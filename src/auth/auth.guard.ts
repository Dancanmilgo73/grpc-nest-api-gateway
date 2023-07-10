import { Injectable, CanActivate, UnauthorizedException, ExecutionContext, Inject, HttpStatus } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ValidateResponse } from "./auth.pb";
import { Request } from "express";

@Injectable()
export class AuthGuard implements CanActivate {
    @Inject(AuthService)
    public readonly service: AuthService;

    public async canActivate(ctx: ExecutionContext): Promise<boolean> | never {
        const req = ctx.switchToHttp().getRequest();
        const authorization: string = req.headers['authorization'];

        if (!authorization) throw new UnauthorizedException();
        const bearer: string[] = authorization.split(' ');

        if (!bearer || bearer.length < 2) throw new UnauthorizedException();

        const token: string = bearer[1];
        // console.log({token});
        
        const { status, userId }: ValidateResponse = await this.service.validate(token);

        req.body.user = userId;

        if (status !== HttpStatus.OK) throw new UnauthorizedException();

        return true;
    } 
}