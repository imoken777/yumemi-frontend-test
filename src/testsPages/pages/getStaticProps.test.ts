/**
 * @jest-environment node
 */

import type { GetStaticPropsContext } from 'next';
import { fetchPrefectureData } from '../../lib/fetchPrefectureData';
import { getStaticProps } from '../../pages';

jest.mock('../../lib/fetchPrefectureData', () => ({
  fetchPrefectureData: jest.fn(),
}));

describe('getStaticProps', () => {
  test('returns prefecturesWithCheck when fetch is successful', async () => {
    const prefData = [{ prefCode: 1, prefName: 'Hokkaido', isChecked: false }];
    (fetchPrefectureData as jest.Mock).mockResolvedValue(prefData);

    const context = {} as GetStaticPropsContext;
    const result = await getStaticProps(context);

    expect(result).toEqual({
      props: {
        prefecturesWithCheck: prefData,
      },
      revalidate: 60,
    });
  });

  test('returns empty prefecturesWithCheck when fetch fails', async () => {
    (fetchPrefectureData as jest.Mock).mockResolvedValue(null);
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const context = {} as GetStaticPropsContext;
    const result = await getStaticProps(context);

    expect(result).toEqual({
      props: {
        prefecturesWithCheck: [],
      },
      revalidate: 30,
    });

    consoleErrorSpy.mockRestore();
  });

  test('handles fetchPrefectureData errors gracefully', async () => {
    (fetchPrefectureData as jest.Mock).mockRejectedValue(new Error('Fetch error'));

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const context = {} as GetStaticPropsContext;
    const result = await getStaticProps(context);

    expect(result).toEqual({
      props: {
        prefecturesWithCheck: [],
      },
      revalidate: 30,
    });

    consoleErrorSpy.mockRestore();
  });
});
