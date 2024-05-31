import '@testing-library/jest-dom';
import { fireEvent, render } from '@testing-library/react';
import type { ComponentProps } from 'react';
import PrefectureCheckBoxes from './PrefectureCheckBoxes';

type Props = ComponentProps<typeof PrefectureCheckBoxes>;

describe('PrefectureCheckBoxes', () => {
  const defaultProps: Props = {
    prefectures: [
      { prefCode: 1, prefName: '北海道', isChecked: true },
      { prefCode: 2, prefName: '青森県', isChecked: false },
    ],
    handlePrefectureCheckbox: jest.fn(),
  };

  test('should render without crashing', () => {
    const { container } = render(<PrefectureCheckBoxes {...defaultProps} />);
    expect(container).toBeInTheDocument();
  });

  test('should display the correct number of checkboxes', () => {
    const { getAllByRole } = render(<PrefectureCheckBoxes {...defaultProps} />);
    const checkboxes = getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(defaultProps.prefectures.length);
  });

  test('should have checkboxes with correct initial states', () => {
    const { getByLabelText } = render(<PrefectureCheckBoxes {...defaultProps} />);
    expect(getByLabelText('北海道')).toBeChecked();
    expect(getByLabelText('青森県')).not.toBeChecked();
  });

  test('should call handlePrefectureCheckbox when a checkbox is clicked', () => {
    const handlePrefectureCheckbox = jest.fn();
    const props = { ...defaultProps, handlePrefectureCheckbox };
    const { getByLabelText } = render(<PrefectureCheckBoxes {...props} />);

    const checkbox = getByLabelText('青森県');
    fireEvent.click(checkbox);

    expect(handlePrefectureCheckbox).toHaveBeenCalledTimes(1);
  });

  test('should toggle checkbox state on click', () => {
    const handlePrefectureCheckbox = jest.fn();
    const props = { ...defaultProps, handlePrefectureCheckbox };
    const { getByLabelText } = render(<PrefectureCheckBoxes {...props} />);

    const checkbox = getByLabelText('北海道');
    fireEvent.click(checkbox);

    expect(handlePrefectureCheckbox).toHaveBeenCalledWith(expect.any(Object));
  });
});
