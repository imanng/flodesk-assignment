import {
  type ElementBuilderSettingsProps,
  settingsItem,
  type SettingsSection,
} from '@/components/form';
import type { ElementType } from '@/types/template';

import { AlignmentField } from './alignment-field';
import {
  BackgroundColorField,
  BorderRadiusField,
  ButtonHrefField,
  ButtonLabelField,
  ButtonTargetField,
  DividerColorField,
  FontSizeField,
  HeadingLevelField,
  ImageAltField,
  PaddingField,
  TextColorField,
  TextContentField,
} from './field-components';
import { FontWeightField } from './font-weight-field';
import { ImageSourceField } from './image-source-field';

export const ELEMENT_SETTINGS_SECTIONS: Record<
  ElementType,
  SettingsSection<ElementBuilderSettingsProps>[]
> = {
  text: [
    {
      id: 'content',
      items: [
        settingsItem('text-content', (props) => (
          <TextContentField {...props} rows={4} />
        )),
      ],
    },
    {
      id: 'style',
      items: [
        settingsItem('font-size', (props) => <FontSizeField {...props} />),
        settingsItem('text-color', (props) => <TextColorField {...props} />),
        settingsItem('background-color', (props) => (
          <BackgroundColorField {...props} />
        )),
        settingsItem('alignment', (props) => <AlignmentField {...props} />),
        settingsItem('font-weight', (props) => <FontWeightField {...props} />),
      ],
    },
    {
      id: 'spacing',
      items: [settingsItem('padding', (props) => <PaddingField {...props} />)],
    },
  ],
  heading: [
    {
      id: 'content',
      items: [
        settingsItem('heading-level', (props) => <HeadingLevelField {...props} />),
        settingsItem('text-content', (props) => (
          <TextContentField {...props} rows={3} />
        )),
      ],
    },
    {
      id: 'style',
      items: [
        settingsItem('font-size', (props) => <FontSizeField {...props} />),
        settingsItem('text-color', (props) => <TextColorField {...props} />),
        settingsItem('background-color', (props) => (
          <BackgroundColorField {...props} />
        )),
        settingsItem('alignment', (props) => <AlignmentField {...props} />),
        settingsItem('font-weight', (props) => <FontWeightField {...props} />),
      ],
    },
    {
      id: 'spacing',
      items: [settingsItem('padding', (props) => <PaddingField {...props} />)],
    },
  ],
  button: [
    {
      id: 'content',
      items: [
        settingsItem('button-label', (props) => <ButtonLabelField {...props} />),
        settingsItem('button-href', (props) => <ButtonHrefField {...props} />),
        settingsItem('button-target', (props) => <ButtonTargetField {...props} />),
      ],
    },
    {
      id: 'style',
      items: [
        settingsItem('font-size', (props) => <FontSizeField {...props} />),
        settingsItem('text-color', (props) => <TextColorField {...props} />),
        settingsItem('background-color', (props) => (
          <BackgroundColorField {...props} />
        )),
        settingsItem('alignment', (props) => <AlignmentField {...props} />),
        settingsItem('font-weight', (props) => <FontWeightField {...props} />),
      ],
    },
    {
      id: 'spacing',
      items: [
        settingsItem('padding', (props) => <PaddingField {...props} />),
        settingsItem('border-radius', (props) => <BorderRadiusField {...props} />),
      ],
    },
  ],
  image: [
    {
      id: 'content',
      items: [
        settingsItem('image-source', (props) => <ImageSourceField {...props} />),
        settingsItem('image-alt', (props) => <ImageAltField {...props} />),
      ],
    },
    {
      id: 'style',
      items: [
        settingsItem('background-color', (props) => (
          <BackgroundColorField {...props} />
        )),
      ],
    },
    {
      id: 'spacing',
      items: [
        settingsItem('padding', (props) => <PaddingField {...props} />),
        settingsItem('border-radius', (props) => <BorderRadiusField {...props} />),
      ],
    },
  ],
  divider: [
    {
      id: 'style',
      items: [
        settingsItem('divider-color', (props) => <DividerColorField {...props} />),
      ],
    },
  ],
};
