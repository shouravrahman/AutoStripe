import { Router } from "express";
import { createCredential, getCredentials, deleteCredential, connectDoppler } from "../controllers/credential.controller";
import { isAuthenticated } from "../middleware/isAuthenticated";

const router = Router();

router.use(isAuthenticated);

router.post("/", createCredential);
router.get("/", getCredentials);
router.delete("/:id", deleteCredential);
router.post("/doppler", connectDoppler);

export default router;