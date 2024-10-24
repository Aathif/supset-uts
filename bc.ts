import { temporalColumnMixin } from './path_to_file';
import { getTemporalColumns } from '../utils';

jest.mock('../utils', () => ({
  getTemporalColumns: jest.fn(),
}));

describe('temporalColumnMixin', () => {
  it('should map state to props with correct temporal columns', () => {
    const datasource = {};
    const mockTemporalColumns = {
      temporalColumns: ['col1', 'col2'],
      defaultTemporalColumn: 'col1',
    };
    getTemporalColumns.mockReturnValue(mockTemporalColumns);

    const props = temporalColumnMixin.mapStateToProps({ datasource });
    expect(getTemporalColumns).toHaveBeenCalledWith(datasource);
    expect(props).toEqual({
      options: ['col1', 'col2'],
      default: 'col1',
    });
  });
});
