import admin from "../firebase.js";

export const registerUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
    });

    return res.json({
      status: "ok",
      message: "Usuario creado",
      uid: userRecord.uid,
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  const { idToken } = req.body;

  try {
    const decoded = await admin.auth().verifyIdToken(idToken);

    return res.json({
      status: "ok",
      message: "Usuario verificado",
      uid: decoded.uid,
    });
  } catch (error) {
    return res.status(401).json({
      status: "error",
      message: "Token inválido",
    });
  }
};
