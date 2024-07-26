import { SyntheticEvent } from 'react';
import domToPdf from 'dom-to-pdf';
import { kebabCase } from 'lodash';
import { logging, t } from '@superset-ui/core';
import { addWarningToast } from 'src/components/MessageToasts/actions';
import downloadAsPdf from './yourModulePath'; // replace with the actual path

jest.mock('dom-to-pdf', () => jest.fn());
jest.mock('lodash/kebabCase', () => jest.fn());
jest.mock('@superset-ui/core', () => ({
  logging: {
    error: jest.fn(),
  },
  t: jest.fn(),
}));
jest.mock('src/components/MessageToasts/actions', () => ({
  addWarningToast: jest.fn(),
}));

describe('downloadAsPdf', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call addWarningToast if element to print is not found', () => {
    const mockSelector = '.non-existing-selector';
    const mockDescription = 'Test Description';
    const handler = downloadAsPdf(mockSelector, mockDescription);
    const mockEvent = {
      currentTarget: {
        closest: jest.fn().mockReturnValue(null),
      },
    } as unknown as SyntheticEvent;

    handler(mockEvent);

    expect(addWarningToast).toHaveBeenCalledWith(
      t('PDF download failed, please refresh and try again.')
    );
  });

  it('should call domToPdf with correct options and filename', () => {
    const mockSelector = '.existing-selector';
    const mockDescription = 'Test Description';
    const mockElement = document.createElement('div');
    document.body.appendChild(mockElement);
    const handler = downloadAsPdf(mockSelector, mockDescription, true);
    const mockEvent = {
      currentTarget: {
        closest: jest.fn().mockReturnValue(mockElement),
      },
    } as unknown as SyntheticEvent;

    const expectedFilename = `${kebabCase(mockDescription)}-${new Date().toISOString().replace(/[: ]/g, '-')}.pdf`;
    const options = {
      margin: 10,
      filename: expectedFilename,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { scale: 2 },
      excludeClassNames: ['header-controls'],
    };

    domToPdf.mockResolvedValue(Promise.resolve());

    handler(mockEvent);

    expect(domToPdf).toHaveBeenCalledWith(mockElement, options);
  });

  it('should log an error if domToPdf fails', async () => {
    const mockSelector = '.existing-selector';
    const mockDescription = 'Test Description';
    const mockElement = document.createElement('div');
    document.body.appendChild(mockElement);
    const handler = downloadAsPdf(mockSelector, mockDescription, true);
    const mockEvent = {
      currentTarget: {
        closest: jest.fn().mockReturnValue(mockElement),
      },
    } as unknown as SyntheticEvent;

    const error = new Error('PDF generation failed');
    domToPdf.mockRejectedValue(Promise.reject(error));

    await handler(mockEvent);

    expect(logging.error).toHaveBeenCalledWith('PDF generation failed', error);
  });

  it('should use closest if isExactSelector is false', () => {
    const mockSelector = '.existing-selector';
    const mockDescription = 'Test Description';
    const mockElement = document.createElement('div');
    document.body.appendChild(mockElement);
    const handler = downloadAsPdf(mockSelector, mockDescription, false);
    const mockEvent = {
      currentTarget: {
        closest: jest.fn().mockReturnValue(mockElement),
      },
    } as unknown as SyntheticEvent;

    const options = {
      margin: 10,
      filename: `${kebabCase(mockDescription)}-${new Date().toISOString().replace(/[: ]/g, '-')}.pdf`,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { scale: 2 },
      excludeClassNames: ['header-controls'],
    };

    domToPdf.mockResolvedValue(Promise.resolve());

    handler(mockEvent);

    expect(domToPdf).toHaveBeenCalledWith(mockElement, options);
  });
});
