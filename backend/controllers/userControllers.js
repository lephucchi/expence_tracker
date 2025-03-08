import { pool } from "./../libs/database.js";
import { comparePassword, hashPassword } from "../libs/index.js";

export const getUser = async (req, res) => {
  try {
    const { userId } = req.body.user;

    const userExist = await pool.query({
      text: `SELECT * FROM tbluser WHERE id = $1`,
      values: [userId],
    });

    const user = userExist.rows[0];

    if (!user) {
      return res.status(404).json({
        status: "failed",
        massage: "User not found",
      });
    }

    user.password = undefined;

    res.status(201).json({
      status: "success",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "failed", message: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { userId } = req.body.user;

    const { currentPassword, newPassword, confirmPassword } = req.body;

    const userExist = await pool.query({
      text: `SELECT * FROM tbluser WHERE id = $1`,
      values: [userId],
    });

    const user = userExist.rows[0];

    console.log("userid: ", user);

    if (!user) {
      return res.status(404).json({
        status: "ngu vcl",
        massage: "(deo thay USER dau) sai me may roi con oi",
      });
    }

    if (newPassword != confirmPassword) {
      return res.status(401).json({
        status: "ngu vcl",
        massage: "mat khau deo khop nhau kia thang ngu",
      });
    }

    const isMatch = await comparePassword(currentPassword, user?.password);

    if (!isMatch) {
      return res.status(401).json({
        status: "may ngu vcl",
        massage: "Invalid current password",
      });
    }

    const hashedPassword = await hashPassword(newPassword);

    const updatedUser = await pool.query({
      text: `UPDATE tbluser SET password = $1 WHERE id = $2`,
      values: [hashedPassword, userId],
    });

    return res.json({
      user: updatedUser,
      message: "TAI ROI",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "failed", message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { userId } = req.body.userId;
    const { firstname, lastname, country, currency, contact } = req.body;

    const userExist = await pool.query({
      text: `SELECT * FROM tbluser WHERE id = $1`,
      values: [userId],
    });

    const user = userExist.rows[0];

    if (!user) {
      return res.status(404).json({
        status: "failed",
        message: "user not found",
      });
    }

    const updatedUser = await pool.query({
      text: "UPDATE tbluser SET firstname = $1 , lastname = $2 , country = $3 , currency = $4 , contract = $5 , updatedar = CURRENT_TIMESTAMP WHERE id = $6 RETURNING *",
      value: [firstname, lastname, country, currency, contact, userId],
    });

    updatedUser.rows[0].password = undefined;

    res.status(200).json({
      status: "success",
      massage: "TAI` ROI`",
      user: updatedUser.row[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "failed", message: error.message });
  }
};

// export const changePassword =  async(req , res)=>{
//     try {

//     } catch (error) {
//         console.log(error);
//         res.status(500).json ({status : "failed" , message: error.message});
//     }
// }
