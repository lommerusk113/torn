export class TargetController {
    targetService;
    constructor(targetService) {
        this.targetService = targetService;
    }
    async getTargets(req, res) {
        try {
            const { user, key } = req.query;
            if (!user) {
                return res.status(403).json({ message: "Missing userId" });
            }
            if (!key) {
                return res.status(403).json({ message: "Missing api key" });
            }
            const target = await this.targetService.getTargetUrl(user, key);
            if (target) {
                return res.redirect(target);
            }
            return res.status(404).json({ message: "No target found" });
        }
        catch (error) {
            console.error("Error fetching target URL:", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
}
