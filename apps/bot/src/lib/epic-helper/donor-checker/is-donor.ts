import donorService from '../../../services/database/donor.service';
import freeDonorService from '../../../services/database/free-donor.service';

interface IIsDonor {
  userId: string;
}

export const _isDonor = async ({userId}: IIsDonor) => {
  const donor = await donorService.findDonor({
    discordUserId: userId,
  });
  if (donor?.tier && donor?.expiresAt && donor?.expiresAt.getTime() > Date.now()) {
    return true;
  }
  const freeDonor = await freeDonorService.findFreeDonor({
    discordUserId: userId,
  });
  return !!freeDonor?.expiresAt && freeDonor?.expiresAt.getTime() > Date.now();
};
