import { SyntheticEvent } from 'react';
import domToImage from 'dom-to-image-more';
import { kebabCase } from 'lodash';
import { t, supersetTheme } from '@superset-ui/core';
import { addWarningToast } from 'src/components/MessageToasts/actions';
import downloadAsImage from './yourModulePath'; // replace with the actual path

jest.mock('dom-to-image-more', () => ({
  toJpeg: jest.fn(),
}));
jest.mock('lodash/kebabCase', () => jest.fn());
jest.mock('@superset-ui/core', () => ({
  t: jest.fn(),
  supersetTheme: {
    colors: {
      grayscale: {
        light4: '#f0f0f0',
      },
    },
  },
}));
jest.mock('src/components/MessageToasts/actions', () => ({
  addWarningToast: jest.fn(),
}));

describe('downloadAsImage', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call addWarningToast if element to print is not found', () => {
    const mockSelector = '.non-existing-selector';
    const mockDescription = 'Test Description';
    const handler = downloadAsImage(mockSelector, mockDescription);
    const mockEvent = {
      currentTarget: {
        closest: jest.fn().mockReturnValue(null),
      },
    } as unknown as SyntheticEvent;

    handler(mockEvent);

    expect(addWarningToast).toHaveBeenCalledWith(
      t('Image download failed, please refresh and try again.')
    );
  });

  it('should call domToImage.toJpeg with correct options and filename', async () => {
    const mockSelector = '.existing-selector';
    const mockDescription = 'Test Description';
    const mockElement = document.createElement('div');
    document.body.appendChild(mockElement);
    const handler = downloadAsImage(mockSelector, mockDescription, true);
    const mockEvent = {
      currentTarget: {
        closest: jest.fn().mockReturnValue(mockElement),
      },
    } as unknown as SyntheticEvent;

    const dataUrl = 'data:image/jpeg;base64,example';
    const expectedFilename = `${kebabCase(mockDescription)}-${new Date().toISOString().replace(/[: ]/g, '-')}.jpg`;
    domToImage.toJpeg.mockResolvedValue(dataUrl);

    await handler(mockEvent);

    const link = document.createElement('a');
    link.download = expectedFilename;
    link.href = dataUrl;
    document.body.appendChild(link); // Append to body to simulate clicking
    link.click = jest.fn();

    expect(domToImage.toJpeg).toHaveBeenCalledWith(mockElement, {
      bgcolor: supersetTheme.colors.grayscale.light4,
      filter: expect.any(Function),
    });
    expect(link.download).toBe(expectedFilename);
    expect(link.href).toBe(dataUrl);
    expect(link.click).toHaveBeenCalled();
  });

  it('should log an error if domToImage.toJpeg fails', async () => {
    const mockSelector = '.existing-selector';
    const mockDescription = 'Test Description';
    const mockElement = document.createElement('div');
    document.body.appendChild(mockElement);
    const handler = downloadAsImage(mockSelector, mockDescription, true);
    const mockEvent = {
      currentTarget: {
        closest: jest.fn().mockReturnValue(mockElement),
      },
    } as unknown as SyntheticEvent;

    const error = new Error('Image creation failed');
    domToImage.toJpeg.mockRejectedValue(Promise.reject(error));
    console.error = jest.fn();

    await handler(mockEvent);

    expect(console.error).toHaveBeenCalledWith('Creating image failed', error);
  });

  it('should use closest if isExactSelector is false', async () => {
    const mockSelector = '.existing-selector';
    const mockDescription = 'Test Description';
    const mockElement = document.createElement('div');
    document.body.appendChild(mockElement);
    const handler = downloadAsImage(mockSelector, mockDescription, false);
    const mockEvent = {
      currentTarget: {
        closest: jest.fn().mockReturnValue(mockElement),
      },
    } as unknown as SyntheticEvent;

    const dataUrl = 'data:image/jpeg;base64,example';
    const expectedFilename = `${kebabCase(mockDescription)}-${new Date().toISOString().replace(/[: ]/g, '-')}.jpg`;
    domToImage.toJpeg.mockResolvedValue(dataUrl);

    await handler(mockEvent);

    expect(domToImage.toJpeg).toHaveBeenCalledWith(mockElement, {
      bgcolor: supersetTheme.colors.grayscale.light4,
      filter: expect.any(Function),
    });
  });
});
