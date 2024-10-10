import React, {
    useEffect,
    useState,
} from 'react';
import {
    isNativeFilter,
    t,
    styled,
    useTheme
} from '@superset-ui/core';
import Icons from 'src/components/Icons';
import Button from 'src/components/Button';
import { useDispatch, useSelector } from 'react-redux';
import { setFilterGroupConfiguration } from 'src/dashboard/actions/nativeFilters';
import { useFilters } from 'src/dashboard/components/nativeFilters/FilterBar/state';
import { addSuccessToast, addDangerToast } from 'src/components/MessageToasts/actions';
import { RootState } from 'src/dashboard/types';
import { Tooltip } from 'src/components/Tooltip';
import { Modal } from 'antd';
import FormRow from 'src/components/FormRow';
import SelectControl from 'src/explore/components/controls/SelectControl';
import TextControl from 'src/explore/components/controls/TextControl';
export type FiltersGroupProps = {
    hideButton?: boolean;
    groupFilterIndex?: any;
    disableModal?: any;
    deleteGrp?: any;
}

const FilterGroup: React.FC<FiltersGroupProps> = ({
    hideButton,
    groupFilterIndex,
    disableModal,
    deleteGrp
}) => {
    const metadata = useSelector<RootState, any>(
        ({ dashboardInfo }) => dashboardInfo.metadata,
      );
    const theme = useTheme();
    const dispatch = useDispatch();
    const [formGroup, setFormGroup] = useState({name: '', filterIds: []});
    const [group, setGroup] = useState(false);
    const [isGroupEdit, setIsGroupEdit] = useState(false);
    let filterArrIds : any = [];
    metadata?.filter_groups && metadata?.filter_groups.map((obj:any) => filterArrIds.push(obj.filterIds));
    let filterIds : any = [].concat(...filterArrIds);

    const filters = useFilters();
    const filterValues = Object.values(filters).filter(isNativeFilter);
    const HeaderButton = styled(Button)`
        padding: 0;
    `;
    useEffect(() => {
        if (deleteGrp === true) {
            deleteGroup(groupFilterIndex)
        } else if (hideButton === true) {
            addGroup(true, groupFilterIndex);
        }
    }, [hideButton, groupFilterIndex, deleteGrp])

    const addGroup = (group = false, isEdit=false) => {
        if (isEdit !== false && metadata?.filter_groups) {
          let data = metadata?.filter_groups[isEdit as any];
          setIsGroupEdit(isEdit);
          if (Object.keys(data).length > 0) {
            setFormGroup({name: data['name'], filterIds: data['filterIds']});
            setGroup(group);
          }
        }
        else if (isEdit === false) {
          setGroup(group);
          setFormGroup({name: '', filterIds: []});
          setIsGroupEdit(false);
          disableModal();
        }
    }

    const deleteGroup = async (isEdit: any) => {
        try {
            if (isEdit !== false && metadata?.filter_groups) {
                let data = metadata?.filter_groups[isEdit as any];
                if ((Object.keys(data).length > 0) && data['filterIds']) {
                    dispatch(await setFilterGroupConfiguration({}, isEdit, 'delete'));
                    dispatch(addSuccessToast(t('Group deleted successfully')));
                    disableModal();
                }
            }
        } catch (error) {
            dispatch(addDangerToast(t('There was an issue while deleting group. Please try again later')));
        }
    }

    const addFilterGroup = (value : any, type : any) : any => {
        let form = {...formGroup};
        form[type] = value;
        setFormGroup(form);
    }

    const saveGroup = async () => {
        try {
            let form = {...formGroup}
            if (!form?.name) {
                dispatch(addDangerToast(t('Please add group name')));
                return false;
            }
            if (form?.filterIds.length === 0) {
                dispatch(addDangerToast(t('Please add filters')));
                return false;
            }
            dispatch(await setFilterGroupConfiguration(form, isGroupEdit, isGroupEdit === false ? 'create' : 'edit'));
            addGroup(false);
            if (isGroupEdit === false) {
                dispatch(addSuccessToast(t('Group created successfully')));
            } else {
                dispatch(addSuccessToast(t('Group updated successfully')));
            }
            setIsGroupEdit(false);
            setFormGroup({name: '', filterIds: []});
            return true;
        } catch (error) {
            dispatch(addDangerToast(t('There was an issue while creating group. Please try again later')));
            return false;
        }
    }
    const getFilterOptions = () => {
        let groupFitlerIds = [...filterIds];
        if (isGroupEdit !== false && metadata?.filter_groups) {
            let data = metadata?.filter_groups[isGroupEdit as any];
            groupFitlerIds = filterIds.filter((ids: any) => !data['filterIds'].includes(ids));
        }
        return filterValues
            .filter(val => !groupFitlerIds.includes(val.id))
            .map(col => ({
                value: col?.id,
                label: col?.type === 'DIVIDER' ? col?.title : col?.name
        }));
    }
    return (
        filterValues.length > 0 && 
        <>
            {hideButton === false && 
                <HeaderButton
                    buttonStyle="link"
                    buttonSize="xsmall"
                    onClick={() => addGroup(true)}
                >
                    <Tooltip
                    placement="right"
                    style={{ cursor: 'pointer' }}
                    title={'Add Group'}
                    trigger={['hover']}
                    >
                    <Icons.Plus iconColor={(theme?.colors?.grayscale?.base || '#666666')} />
                    </Tooltip>
                </HeaderButton>
            }
            <Modal
                    title="Group Filters"
                    visible={group === true}
                    onCancel={() => addGroup(false)}
                    footer={[
                        <Button
                        buttonStyle="tertiary"
                        buttonSize="small"
                        onClick={() => addGroup(false)}
                        >
                        {t('Cancel')}
                        </Button>,
                        <Button
                        buttonStyle="primary"
                        htmlType="submit"
                        buttonSize="small"
                        onClick={saveGroup}
                        >
                        {t('Save')}
                        </Button>
                    ]}
                >
                <FormRow
                    label={t('Group name')}
                    control={
                    <TextControl
                        value={formGroup?.name}
                        onChange={(e: any) => addFilterGroup(e, 'name')}
                    />
                    }
                />
                <FormRow
                    label={t('Filters')}
                    control={
                    <SelectControl
                        value={formGroup?.filterIds}
                        name="Filters Ids"
                        clearable={false}
                        multi={true}
                        options={getFilterOptions()}
                        onChange={(e: any) => addFilterGroup(e, 'filterIds')}
                    />
                    }
                />
            </Modal>
        </>
    )
};
export default React.memo(FilterGroup);
