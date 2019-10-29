import * as express from 'express';
import Handler from './handler';
import User from '../types/user'
import Log from '../log';

const log: Log = new Log("UserHandler");

export default class UserHandler extends Handler {

    private users: Array<User> = [
        User.fromDbJson({
            id: "0",
            email: "jonny@test.com",
            firstName: "Jonny",
            lastName: "Marmor"
        }),
        User.fromDbJson({
            id: "1",
            email: "karsten@test.com",
            firstName: "Karsten",
            lastName: "Stein"
        }),
        User.fromDbJson({
            id: "2",
            email: "katharina@test.com",
            firstName: "Katharina",
            lastName: "Eisen"
        })
    ];

    constructor() {
        super();
        this.router.get("/user", this.getUser.bind(this));
        this.router.put("/user", this.putUser.bind(this));
        this.router.delete("/user", this.deleteUser.bind(this));
    }

    private async getUser(req: express.Request, res: express.Response): Promise<void> {
        try {
            //get user from db with session
            let user: User | undefined = this.users.find((u: User) => u.id == req.session.userId);
            if (user == undefined) {
                log.error("User with a valid session does not exist, not good!");
                res.status(500);
                res.json({
                    "status": "error",
                    "reason": "User does not exist, should never happen"
                });
                return;
            }
            res.json(user);
        } catch (e) {
            log.error(e);
            res.status(500);
            res.json({
                "status": "error",
                "reason": "DB Error"
            });
        }
    }

    private async putUser(req: express.Request, res: express.Response): Promise<void> {
        try {
            let user: User | undefined = this.users.find((u: User) => u.id == req.session.userId);
            if (user == undefined) {
                log.error("cannot edit other user");
                res.status(400);
                res.json({
                    "status": "error",
                    "reason": "wrong user id"
                });
                return;
            }
            let index = this.users.indexOf(user);
            user = new User(
                req.session.userId,
                (req.body.email == undefined) ? user.email : req.body.email,
                (req.body.password == undefined) ? user.password : req.body.password,
                (req.body.firstName == undefined) ? user.firstName : req.body.firstName,
                (req.body.lastName == undefined) ? user.lastName : req.body.lastName
            );
            this.users[index] = user;
            log.info("User with id " + req.session.userId + " edited");
            res.json({
                "status": "success"
            });
        } catch (e) {
            log.error(e);
            res.status(500);
            res.json({
                "status": "error",
                "reason": "DB Error"
            });
        }
    }

    private async deleteUser(req: express.Request, res: express.Response): Promise<void> {
        // delete user with req.session.userId from db, will be implemented 
        // later because it would mess with local mock data
        res.json({
            "status": "success"
        });
    }
}