import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => {
  return {
    secret:
      process.env.JWT_SECRET ||
      'DO NOT USE THIS VALUE. INSTEAD, CREATE A COMPLEX SECRET AND KEEP IT SAFE OUTSIDE OF THE SOURCE CODE.',
    global: true,
    signOptions: { expiresIn: '60s' },
    // issuer: process.env.JWT_TOKEN_ISSUER,
    // accessTokenTtl: parseInt(process.env.JWT_TOKEN_TTL),
  };
});

/**
 * Source: https://stackoverflow.com/a/74903830
 */
