import {
  Bus,
  Plane,
  Train,
  TramFront,
  Footprints,
  Ship,
  Car,
  TrainFront,
} from 'lucide-react-native';
import type { TransportMode } from '@src/mock/types';
import { modeColor } from '@src/theme';

type Props = {
  mode: TransportMode;
  size?: number;
  color?: string;
};

export const ModeIcon = ({ mode, size = 18, color }: Props) => {
  const c = color ?? modeColor[mode];
  switch (mode) {
    case 'train':
      return <Train size={size} color={c} />;
    case 'bus':
      return <Bus size={size} color={c} />;
    case 'flight':
      return <Plane size={size} color={c} />;
    case 'subway':
      return <TrainFront size={size} color={c} />;
    case 'tram':
      return <TramFront size={size} color={c} />;
    case 'taxi':
      return <Car size={size} color={c} />;
    case 'walk':
      return <Footprints size={size} color={c} />;
    case 'ferry':
      return <Ship size={size} color={c} />;
    default:
      return null;
  }
};
