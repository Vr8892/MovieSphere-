const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs/promises");
const path = require("path");
const { randomUUID } = require("crypto");

const isDatabaseAvailable = () => User.db.readyState === 1;
const localUsersFile = path.join(__dirname, "..", "data", "users.json");

const readLocalUsers = async () => {
    try {
        return JSON.parse(await fs.readFile(localUsersFile, "utf8"));
    } catch (error) {
        if (error.code === "ENOENT") return [];
        throw error;
    }
};

const saveLocalUsers = async (users) => {
    await fs.mkdir(path.dirname(localUsersFile), { recursive: true });
    const temporaryFile = `${localUsersFile}.tmp`;
    await fs.writeFile(temporaryFile, JSON.stringify(users, null, 2), "utf8");
    await fs.rename(temporaryFile, localUsersFile);
};

// Helper: generate JWT token
const generateToken = (user) => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not configured");
    }
    return jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
};

// Register User
const registerUser = async (req, res) => {

    try {

        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        // Check if user already exists
        const localUsers = isDatabaseAvailable() ? null : await readLocalUsers();
        const userExists = isDatabaseAvailable()
            ? await User.findOne({ email: normalizedEmail })
            : localUsers.find((localUser) => localUser.email === normalizedEmail);

        if (userExists) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        // Encrypt Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save User
        const user = isDatabaseAvailable()
            ? await User.create({
                name: name.trim(),
                email: normalizedEmail,
                password: hashedPassword
            })
            : {
                _id: randomUUID(),
                name: name.trim(),
                email: normalizedEmail,
                password: hashedPassword
            };

        if (!isDatabaseAvailable()) {
            localUsers.push(user);
            await saveLocalUsers(localUsers);
        }

        const token = generateToken(user);

        res.status(201).json({
            message: "Account Created Successfully",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {

        console.error("Registration error:", error.message);

        res.status(500).json({
            message: error.message
        });

    }

};

// Login User
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        // Check if user exists
        const user = isDatabaseAvailable()
            ? await User.findOne({ email: normalizedEmail })
            : (await readLocalUsers()).find((localUser) => localUser.email === normalizedEmail);

        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        const token = generateToken(user);

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error("Login error:", error.message);
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    registerUser,
    loginUser
};
