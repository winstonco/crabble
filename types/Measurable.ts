import { Text, Image, View, MeasureOnSuccessCallback } from 'react-native';

type Measurable =
  | (React.FC & {
      measure: (callback: MeasureOnSuccessCallback) => void;
    })
  | View
  | Text
  | Image;

export default Measurable;
