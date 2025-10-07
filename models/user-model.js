const pool = require("../database/")

/* ***************************
 *  Get all users
 * ************************** */
async function getAll(currentUserId) {
    try {
        const data = await pool.query("SELECT * FROM account WHERE NOT account_id = $1 ORDER BY account_firstname", [currentUserId])
        if (data.rows.length > 0) {
            return data.rows
        } else {
            throw new Error("No users found.")
        }
    } catch (error) {
        console.error("getallusers error " + error)
    }
}

/* ***************************
 *  Get user by ID
 * ************************** */
async function getUserById(account_id) {
    try {
        const data = await pool.query("SELECT * FROM account WHERE account_id = $1", [account_id])
        return data.rows[0]
    } catch (error) {
        console.error("getuserbyid error " + error)
    }
}

/* ***************************
 *  Update account type
 * ************************** */
async function updateAccountType(
    account_id,
    account_type,
) {
    // account_type = "Client"
    try {
        const data = await pool.query("UPDATE account SET account_type = $1 WHERE account_id = $2 RETURNING *", [account_type, account_id])
        return data.rows[0]
    } catch (error) {
        console.error("model error: " + error)
    }
}

module.exports = { getAll, getUserById, updateAccountType }
