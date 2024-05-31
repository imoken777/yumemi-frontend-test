import { fireEvent, render } from '@testing-library/react';
import type { ComponentProps } from 'react';
import PopulationLabelSelector from './PopulationLabelSelector';

type Props = ComponentProps<typeof PopulationLabelSelector>;

describe('PopulationLabelSelector', () => {
  let defaultProps: Props;
  let handlePopulationLabelChange: jest.Mock;

  beforeEach(() => {
    handlePopulationLabelChange = jest.fn();
    defaultProps = {
      selectedLabel: 'total',
      multilingualPopulationLabels: [
        ['total', 'juvenile', 'workingAge', 'elderly'],
        ['総人口', '年少人口', '生産年齢人口', '老年人口'],
      ],
      handlePopulationLabelChange,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders without crashing', () => {
    const { container } = render(<PopulationLabelSelector {...defaultProps} />);
    expect(container).toBeInTheDocument();
  });

  test('displays the correct options', () => {
    const { getByText } = render(<PopulationLabelSelector {...defaultProps} />);
    expect(getByText('総人口')).toBeInTheDocument();
    expect(getByText('年少人口')).toBeInTheDocument();
    expect(getByText('生産年齢人口')).toBeInTheDocument();
    expect(getByText('老年人口')).toBeInTheDocument();
  });

  test('has the correct initial selected option', () => {
    const { getByTitle } = render(<PopulationLabelSelector {...defaultProps} />);
    const select = getByTitle('Select population label') as HTMLSelectElement;
    expect(select.value).toBe('total');
  });

  test('calls handlePopulationLabelChange when a new option is selected', () => {
    const { getByTitle } = render(<PopulationLabelSelector {...defaultProps} />);
    const select = getByTitle('Select population label') as HTMLSelectElement;

    fireEvent.change(select, { target: { value: 'juvenile' } });

    expect(handlePopulationLabelChange).toHaveBeenCalledTimes(1);
    expect(handlePopulationLabelChange).toHaveBeenCalledWith(expect.any(Object));
  });
});
