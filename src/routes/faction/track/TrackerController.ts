import { TrackerService } from './TrackerService.js';
import { Request, Response } from "express";

export class TrackerController {
    private trackerService: TrackerService;

    constructor(trackerService: TrackerService) {
        this.trackerService = trackerService;
    }

    public async addTracker(req: Request, res: Response): Promise<void> {
        try {
            const factionId = req.query.factionId as string;
            const apiKey = req.query.apiKey as string;

            if (!factionId || !apiKey) {
                res.status(400).json({ error: 'Missing factionId or apiKey' });
                return;
            }

            const result = await this.trackerService.addTracker(factionId, apiKey);
            res.status(200).json({ success: result });
        } catch (error) {
            console.error('Error adding tracker:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    public async removeTracker(req: Request, res: Response): Promise<void> {
        try {
            const factionId = req.query.factionId as string;

            if (!factionId) {
                res.status(400).json({ error: 'factionId query parameter is required' });
                return;
            }

            const result = await this.trackerService.removeTracker(factionId);
            res.status(200).json({ success: result });
        } catch (error) {
            console.error('Error removing tracker:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    public async getAllTrackers(req: Request, res: Response): Promise<void> {
        try {
            //const trackers = await this.trackerService.getAllTrackers();
            const trackers: string[] = []
            res.status(200).json({ trackers });
        } catch (error) {
            console.error('Error getting all trackers:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    public async getAllMembers(req: Request, res: Response): Promise<void> {
        try {

            const factionId = req.query.factionId as string;

            if (!factionId) {
                res.status(400).json({ error: 'factionId query parameter is required' });
                return;
            }

            const members = await this.trackerService.getAllMembers(factionId)
            res.status(200).json({ members });
        } catch (error) {
            console.error('Error getting all members:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }


    public async getMemberHistory(req: Request, res: Response): Promise<void> {
        try {
            const memberId = req.query.memberId as string;

            if (!memberId) {
                res.status(400).json({ error: 'factionId query parameter is required' });
                return;
            }
            const memberData = await this.trackerService.getMemberHistory(memberId)
            res.status(200).json({ memberData });
        } catch (error) {
            console.error('Error getting member:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

}