import { usersService } from "./users.service";
import { refreshTokenService } from "./refresh-token.service";
import type { RegisterDto, LoginDto } from "@/models/user";
import type { UserResponse } from "@/types/user";
import { UnauthorizedError } from "@/utils/errors";
import { ARGON2_OPTIONS } from "@/config/constants";

export const authService = {
  async register(dto: RegisterDto): Promise<{ user: UserResponse; refreshToken: string }> {
    const hashedPassword = await Bun.password.hash(dto.password, ARGON2_OPTIONS);
    const user = await usersService.create({ ...dto, password: hashedPassword });
    const refreshToken = await refreshTokenService.create(user.id);
    return { user, refreshToken };
  },

  async validateCredentials(dto: LoginDto): Promise<{ user: UserResponse; refreshToken: string }> {
    const user = await usersService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedError("Invalid credentials");

    const valid = await Bun.password.verify(dto.password, user.password);
    if (!valid) throw new UnauthorizedError("Invalid credentials");

    const { password: _password, ...userResponse } = user;
    const refreshToken = await refreshTokenService.create(userResponse.id);
    return { user: userResponse, refreshToken };
  },
};
