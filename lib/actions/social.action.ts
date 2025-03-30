import prisma from "@/lib/prisma";

/**
 * Retrieves social media tokens for a given user and platform.
 * @param userId - The ID of the user.
 * @param platform - The social media platform (e.g., "twitter", "instagram").
 * @returns An object with the accessToken, accessTokenSecret (if available), refreshToken, and tokenExpiresAt.
 * @throws An error if the social account is not found.
 */
export async function getSocialAccountTokens(
  userId: string,
  platform: string
): Promise<{
  accessToken: string;
  accessTokenSecret?: string;
  refreshToken?: string;
  tokenExpiresAt?: Date;
}> {
  const socialAccount = await prisma.socialAccount.findUnique({
    where: { userId_platform: { userId, platform } },
  });

  if (!socialAccount) {
    throw new Error(`${platform} account is not connected for this user.`);
  }

  return {
    accessToken: socialAccount.accessToken,
    accessTokenSecret: socialAccount.accessTokenSecret || undefined,
    refreshToken: socialAccount.refreshToken || undefined,
    tokenExpiresAt: socialAccount.tokenExpiresAt || undefined,
  };
}

/**
 * Updates or creates a social account record for a user with new token information.
 * @param userId - The ID of the user.
 * @param platform - The social media platform.
 * @param tokens - The token data to update or create.
 * @returns The upserted social account record.
 */
export async function upsertSocialAccountTokens(
  userId: string,
  platform: string,
  tokens: {
    accessToken: string;
    accessTokenSecret?: string;
    refreshToken?: string;
    tokenExpiresAt?: Date;
  }
) {
  return await prisma.socialAccount.upsert({
    where: { userId_platform: { userId, platform } },
    update: tokens,
    create: {
      userId,
      platform,
      ...tokens,
    },
  });
}
