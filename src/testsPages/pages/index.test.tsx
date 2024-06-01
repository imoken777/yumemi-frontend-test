import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { usePopulationData } from '../../hooks/usePopulationData';
import { usePopulationLabel } from '../../hooks/usePopulationLabel';
import { usePrefectureCheck } from '../../hooks/usePrefectureCheck';
import Home from '../../pages/index';

jest.mock('../../components/PopulationLineGraph/PopulationLineGraph', () => {
  const LineGraphComponent = () => <div>LineGraphComponent</div>;
  LineGraphComponent.displayName = 'LineGraphComponent';
  return LineGraphComponent;
});
jest.mock('../../components/PopulationLabelSelector/PopulationLabelSelector', () => {
  const PopulationLabelSelector = () => <div>PopulationLabelSelector</div>;
  PopulationLabelSelector.displayName = 'PopulationLabelSelector';
  return PopulationLabelSelector;
});
jest.mock('../../components/PrefectureCheckBoxes/PrefectureCheckBoxes', () => {
  const PrefectureCheckBoxes = () => <div>PrefectureCheckBoxes</div>;
  PrefectureCheckBoxes.displayName = 'PrefectureCheckBoxes';
  return PrefectureCheckBoxes;
});

jest.mock('../../hooks/usePopulationData');
jest.mock('../../hooks/usePopulationLabel');
jest.mock('../../hooks/usePrefectureCheck');

describe('Home', () => {
  beforeEach(() => {
    (usePopulationData as jest.Mock).mockReturnValue({
      allPopulationData: {
        boundaryYear: 2020,
        total: [],
        juvenile: [],
        workingAge: [],
        elderly: [],
      },
      updatePopulationData: jest.fn(),
    });

    (usePopulationLabel as jest.Mock).mockReturnValue({
      selectedLabel: 'total',
      handlePopulationLabelChange: jest.fn(),
      multilingualPopulationLabels: [
        ['total', 'juvenile', 'workingAge', 'elderly'],
        ['総人口', '年少人口', '生産年齢人口', '老年人口'],
      ],
    });

    (usePrefectureCheck as jest.Mock).mockReturnValue({
      prefecturesWithCheck: [{ prefCode: 1, prefName: '北海道', isChecked: false }],
      handlePrefectureCheckbox: jest.fn(),
      resetCheckBoxes: jest.fn(),
    });
  });

  test('renders correctly', () => {
    render(<Home prefecturesWithCheck={[]} />);

    expect(screen.getByText('都道府県別人口推移グラフ')).toBeInTheDocument();
    expect(screen.getByText('PrefectureCheckBoxes')).toBeInTheDocument();
    expect(screen.getByText('PopulationLabelSelector')).toBeInTheDocument();
    expect(screen.getByText('LineGraphComponent')).toBeInTheDocument();
    expect(screen.getByText('全てのチェックを外す')).toBeInTheDocument();
  });

  test('calls resetCheckBoxes when reset button is clicked', () => {
    const { resetCheckBoxes } = usePrefectureCheck(
      [{ prefCode: 1, prefName: '北海道', isChecked: true }],
      {
        boundaryYear: 2020,
        total: [],
        juvenile: [],
        workingAge: [],
        elderly: [],
      },
      jest.fn(),
    );

    render(<Home prefecturesWithCheck={[]} />);

    const resetButton = screen.getByText('全てのチェックを外す');
    fireEvent.click(resetButton);

    expect(resetCheckBoxes).toHaveBeenCalled();
  });
});
