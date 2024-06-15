const express = require('express')
const db = require('../db')
const bcrypt = require('bcrypt')
const {BCRYPT_WORK_FACTOR} = require('../config')
const {BadRequestError, UnauthorizedError} = require('../expressErrors')

class User {
    /** Authenticates user/password
     * 
     * (username, password) => {username, password, firstName, lastName, email, isAdmin, last_activity}
     * 
     */
    static async authenticateUser(username, password) {
        const result = await db.query(
            `SELECT username,
                    password,
                    first_name as "firstName",
                    last_name as "lastName",
                    email,
                    is_admin as "isAdmin",
                    last_activity
            FROM users
            WHERE username=$1`, [username],
        );

        const user = result.rows[0];
        
        if (user) {
            const isValid = await bcrypt.compare(password, user.password);
            if (isValid === true) {
                delete user.password;
                return user;
            };
        };
        
        throw new UnauthorizedError("Invalid username/password");
    }

    /** Register new user
     * 
     * (username, password, first, last, email) 
     *  => ('User has successfully been created')
     * 
     */
    static async register(username, password, first, last, email) {
        const dupeUser = await db.query(
            `SELECT username 
                FROM users 
                WHERE username=$1`, [username]) 
        if (dupeUser.rows[0]) throw new BadRequestError('Username is already in use')

        const dupeEmail = await db.query(
            `SELECT email 
                FROM users 
                WHERE email=$1`, [email])
        if (dupeEmail.rows[0]) throw new BadRequestError('Email is already in use')

        password = await bcrypt.hash(password, BCRYPT_WORK_FACTOR)

        const result = await db.query(
            `INSERT INTO users 
                        (username, 
                         password,
                         first_name,
                         last_name,
                         email)
                         VALUES ($1, $2, $3, $4, $5)`, [username, password, first, last, email],
        );
        return {msg:'User has successfully been created', code: 200}
    }

    static async delUser(username) {
        await db.query(
            `DELETE FROM users
                    WHERE username=$1`, [username]
        );
        return {msg:'User has successfully been delete', code: 200}
    }

    static async createToken() {
        process.env.SECRET_KEY
    }


}

module.exports = User;