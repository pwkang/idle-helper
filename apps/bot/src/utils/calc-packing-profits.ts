import type {TAX_RATE_BOX} from '@idle-helper/constants';

interface ICalculatePackingProfits {
  boxPrice: number;
  itemPrice: number;
  taxValue: ValuesOf<typeof TAX_RATE_BOX>;
  multiplier: number;
}

export const calculatePackingProfits = ({
  boxPrice,
  multiplier,
  itemPrice,
  taxValue
}: ICalculatePackingProfits) => {
  return boxPrice * multiplier * taxValue - itemPrice * 100;
};
