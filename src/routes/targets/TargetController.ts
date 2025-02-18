import { Request, Response } from "express";
import { TargetService } from "./TargetService.js";
import { TornApiService } from "../../service/TornApiService.js";

export class TargetController {
    private targetService: TargetService;

    constructor(targetService: TargetService) {
        this.targetService = targetService;
    }

    public async getTargets(req: Request, res: Response): Promise<any> {
        try {
            const {user, key} = req.query

            if (!user) {
                return res.status(403).json({ message: "Missing userId" });
            }

            if (!key) {
                return res.status(403).json({ message: "Missing api key" });
            }

            const target = await this.targetService.getTargetUrl(user as string, key as string);
            if (target) {
                return res.redirect(target);
            }

            return res.status(404).json({ message: "No target found" });

        } catch (error) {
            console.error("Error fetching target URL:", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
}
