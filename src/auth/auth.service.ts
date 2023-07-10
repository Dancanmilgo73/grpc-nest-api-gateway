import { Inject, Injectable } from '@nestjs/common';
import { AUTH_SERVICE_NAME, AuthServiceClient, ValidateResponse } from './auth.pb';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable, firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
    private svc: AuthServiceClient;

    @Inject(AUTH_SERVICE_NAME)
    private readonly client: ClientGrpc;

    public onModuleInit(): void {
        this.svc = this.client.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
    }

    public async validate(token: string): Promise<ValidateResponse> {
        // return this.svc.validate({ token })[0];
        return firstValueFrom(this.svc.validate({token}));
    }
}

