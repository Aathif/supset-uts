import InteractiveTableUtils from './InteractiveTableUtils';
import { SUPERSET_TABLE_COLUMN } from 'src/components/Table';
import { withinRange } from './utils';

describe('InteractiveTableUtils', () => {
  let tableElement: HTMLTableElement;
  let columns: any[];
  let setDerivedColumns: jest.Mock;
  let interactiveTableUtils: InteractiveTableUtils;

  beforeEach(() => {
    tableElement = document.createElement('table');
    const headerRow = document.createElement('tr');
    for (let i = 0; i < 3; i++) {
      const cell = document.createElement('th');
      cell.style.width = '100px';
      headerRow.appendChild(cell);
    }
    tableElement.appendChild(headerRow);
    document.body.appendChild(tableElement);

    columns = [
      { title: 'Column 1', dataIndex: 'col1', width: 100 },
      { title: 'Column 2', dataIndex: 'col2', width: 100 },
      { title: 'Column 3', dataIndex: 'col3', width: 100 },
    ];
    setDerivedColumns = jest.fn();

    interactiveTableUtils = new InteractiveTableUtils(
      tableElement,
      columns,
      setDerivedColumns,
    );
  });

  afterEach(() => {
    document.body.removeChild(tableElement);
  });

  it('should initialize with correct default values', () => {
    expect(interactiveTableUtils.resizable).toBe(false);
    expect(interactiveTableUtils.reorderable).toBe(false);
    expect(interactiveTableUtils.derivedColumns.length).toBe(3);
  });

  it('should update tableRef when setTableRef is called', () => {
    const newTable = document.createElement('table');
    interactiveTableUtils.setTableRef(newTable);
    expect(interactiveTableUtils.tableRef).toBe(newTable);
  });

  it('should correctly get the column index', () => {
    const columnIndex = interactiveTableUtils.getColumnIndex();
    expect(columnIndex).toBe(-1); // No columnRef is set initially
  });

  it('should handle column drag start', () => {
    const mockEvent = {
      currentTarget: tableElement.querySelector('th'),
      dataTransfer: { setData: jest.fn() },
    } as unknown as DragEvent;

    interactiveTableUtils.handleColumnDragStart(mockEvent);
    expect(interactiveTableUtils.isDragging).toBe(true);
    expect(mockEvent.dataTransfer.setData).toHaveBeenCalledWith(
      SUPERSET_TABLE_COLUMN,
      expect.any(String),
    );
  });

  it('should handle drag drop and reorder columns', () => {
    interactiveTableUtils.handleColumnDragStart({
      currentTarget: tableElement.querySelector('th'),
      dataTransfer: { setData: jest.fn() },
    } as unknown as DragEvent);

    const secondColumn = tableElement.querySelectorAll('th')[1];
    const mockDropEvent = {
      currentTarget: secondColumn,
      dataTransfer: {
        getData: jest.fn().mockReturnValue(
          JSON.stringify({ index: 0, columnData: columns[0] }),
        ),
      },
      preventDefault: jest.fn(),
    } as unknown as DragEvent;

    interactiveTableUtils.handleDragDrop(mockDropEvent);
    expect(setDerivedColumns).toHaveBeenCalledWith([
      columns[1],
      columns[0],
      columns[2],
    ]);
  });

  it('should allow drop', () => {
    const mockEvent = {
      preventDefault: jest.fn(),
    } as unknown as DragEvent;

    interactiveTableUtils.allowDrop(mockEvent);
    expect(mockEvent.preventDefault).toHaveBeenCalled();
  });

  it('should handle mouse down for resizing', () => {
    const firstColumn = tableElement.querySelector('th');
    const mockMouseEvent = {
      currentTarget: firstColumn,
      offsetX: 95,
      x: 100,
    } as unknown as MouseEvent;

    withinRange.mockReturnValueOnce(true); // Mock withinRange utility to return true
    interactiveTableUtils.handleMouseDown(mockMouseEvent);
    expect(interactiveTableUtils.columnRef).toBe(firstColumn);
    expect(interactiveTableUtils.columnRef?.mouseDown).toBe(true);
  });

  it('should handle mouse move for resizing', () => {
    const firstColumn = tableElement.querySelector('th');
    interactiveTableUtils.columnRef = firstColumn as unknown as IInteractiveColumn;
    interactiveTableUtils.resizable = true;
    interactiveTableUtils.columnRef.mouseDown = true;
    interactiveTableUtils.columnRef.oldX = 100;
    interactiveTableUtils.columnRef.oldWidth = 100;

    const mockMouseEvent = {
      currentTarget: firstColumn,
      offsetX: 105,
      x: 120,
    } as unknown as MouseEvent;

    interactiveTableUtils.handleMouseMove(mockMouseEvent);
    expect(setDerivedColumns).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ width: 120 }),
      ]),
    );
  });

  it('should handle mouse up and reset states', () => {
    const firstColumn = tableElement.querySelector('th');
    interactiveTableUtils.columnRef = firstColumn as unknown as IInteractiveColumn;
    interactiveTableUtils.handleMouseup();
    expect(interactiveTableUtils.columnRef?.mouseDown).toBe(false);
    expect(interactiveTableUtils.isDragging).toBe(false);
  });

  it('should initialize resizable columns', () => {
    interactiveTableUtils.initializeResizableColumns(true, tableElement);
    const firstColumn = tableElement.querySelector('th');
    const mousedownEvent = new MouseEvent('mousedown');
    firstColumn?.dispatchEvent(mousedownEvent);
    expect(interactiveTableUtils.resizable).toBe(true);
  });

  it('should initialize drag and drop columns', () => {
    interactiveTableUtils.initializeDragDropColumns(true, tableElement);
    const firstColumn = tableElement.querySelector('th');
    const dragstartEvent = new DragEvent('dragstart');
    firstColumn?.dispatchEvent(dragstartEvent);
    expect(interactiveTableUtils.reorderable).toBe(true);
  });

  it('should clear all event listeners', () => {
    interactiveTableUtils.clearListeners();
    const firstColumn = tableElement.querySelector('th');
    const mousedownEvent = new MouseEvent('mousedown');
    firstColumn?.dispatchEvent(mousedownEvent);
    expect(interactiveTableUtils.resizable).toBe(false);
    expect(interactiveTableUtils.reorderable).toBe(false);
  });
});
