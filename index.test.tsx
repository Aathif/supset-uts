import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { max as d3Max } from 'd3-array';
import Button from 'src/components/Button';
import { Popover } from 'antd';
import * as d3 from "d3";
import { styled, t, SupersetClient, formatNumber, formatTime } from '@superset-ui/core';
import moment from 'moment';
import Icons from 'src/components/Icons';
import { Sparklines, SparklinesLine } from 'react-sparklines';
import { BOOL_FALSE_DISPLAY, BOOL_TRUE_DISPLAY } from 'src/constants';
import DateFilterControl from 'src/explore/components/controls/DateFilterControl';
import ControlRow from 'src/explore/components/ControlRow';
import Control from 'src/explore/components/Control';
import { controls } from 'src/explore/controls';
import { getExploreUrl } from 'src/explore/exploreUtils';
import { getChartDataRequest } from 'src/components/Chart/chartAction';
import NoResultsComponent from '../../../../packages/superset-ui-core/src/chart/components/NoResultsComponent'
import './BucketKPI.less';
import { BsArrowUp } from '@react-icons/all-files/bs/BsArrowUp';
import { BsArrowDown } from '@react-icons/all-files/bs/BsArrowDown';
import { BsArrowLeft } from '@react-icons/all-files/bs/BsArrowLeft';
import { BsArrowRight } from '@react-icons/all-files/bs/BsArrowRight';
import { BsArrowDownLeft } from '@react-icons/all-files/bs/BsArrowDownLeft';
import { BsArrowDownRight } from '@react-icons/all-files/bs/BsArrowDownRight';
import { BsArrowUpLeft } from '@react-icons/all-files/bs/BsArrowUpLeft';
import { BsArrowUpRight } from '@react-icons/all-files/bs/BsArrowUpRight';
import { AntdInput, AntdSwitch, Col, Row } from 'src/components';
import { saveSlice } from 'src/explore/actions/saveModalActions';
import { getDashboardId } from 'src/dashboard/components/nativeFilters/state'
import { Form, FormItem } from 'src/components/Form';
import { addSuccessToast, addDangerToast } from 'src/components/MessageToasts/actions';

export const updateValueByJS = (input, value) => {
  let lastValue = input.value;
  input.value = value;
  
  let event = new Event('input', { bubbles: true });
  // hack React15
  event.simulated = true;
  // hack React16 ?????descriptor??value,??????
  let tracker = input._valueTracker;
  if (tracker) {
    tracker.setValue(lastValue);
  }
  input.dispatchEvent(event);
 }

 const JustifyEnd = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const container = document.getElementById('app');
const bootstrap = JSON.parse(container?.getAttribute('data-bootstrap') || '{}');
const user = { ...bootstrap.user };
const roles = Object.keys(user?.roles || {});

class BucketKPI extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data,
      orderByCols: this.props.bucketKpiOrderByCols || '',
      metric: this.props.metric,
      bucketkpivalue: '',
      bucketkpiprevvalue: this.props?.bucketkpivalue,
      popupVisible: false
    }
  }

  componentDidMount(){
    if (document.querySelector('[data-test="bucket_kpi_order_by_cols"]') !== null) {
      document.querySelector('[data-test="bucket_kpi_order_by_cols"]').style.display = 'none'
    }
  }


  componentDidUpdate(prevProps) {
    if ((_.isEqual(prevProps.data, this.props.data) === false) || prevProps.bucketKpiOrderByCols !== this.props.bucketKpiOrderByCols) {
      this.setState({data: this.props.data, orderByCols: this.props.bucketKpiOrderByCols || ''})
    }

    var button = document.getElementsByTagName("button");
    for (var i = 0; i < button.length; i++) {
      if (button[i].innerHTML === "<span>Run query</span>") {
        if (_.isEqual(prevProps.groupby, this.props.groupby) === false) {
          let input = document.querySelector('[data-test="bucket_kpi_order_by_cols"]')?.querySelector('input');
          if (input) {
            updateValueByJS(input, '')
          }
        }
      }
    }
  }

  createMarkup(val) {
    return {
       __html:  val  };
  }; 

  createMarkupWithIcon(val) {
    return {
       __html:  <span><i className='fa fa-edit'></i></span>};
  }; 

  avg = (resArr) => {
    return _.sum(resArr) / resArr.length;
  };

  getAggregationVal = (resArr, aggregation) => {
    switch (aggregation.toLowerCase()) {
      case 'max':
        return d3.max(resArr);
      case 'min':
        return d3.min(resArr);
      case 'sum':
        return d3.sum(resArr);
      case 'mean':
        return d3.mean(resArr);
      case 'avg':
        return this.avg(resArr);
      case 'std':
        return d3.deviation(resArr);
      case 'var':
        return d3.variance(resArr);
      default:
        return '';
    }
  }

  iconOptions = (str, color) => {
    switch (str) {
      case 'BsArrowUp':
        return <BsArrowUp color={color} />
      case 'BsArrowDown':
        return <BsArrowDown color={color} />
      case 'BsArrowLeft':
        return <BsArrowLeft color={color} />
      case 'BsArrowRight':
        return <BsArrowRight color={color} />
      case 'BsArrowDownLeft':
        return <BsArrowDownLeft color={color} />
      case 'BsArrowDownRight':
        return <BsArrowDownRight color={color} />
      case 'BsArrowUpLeft':
        return <BsArrowUpLeft color={color} />
      case 'BsArrowUpRight':
        return <BsArrowUpRight color={color} />
      case 'None':
        return '';
      default:
        return '';
    }
  }

  prepareData = () => {
    let tdHead = [];
    let tdBody = [];
    let verticalData = {};
    let aggregationData = {};
    const { code, isCategory, pandasAggfunc, numberFormat = '~g', dateFormat='', bucketkpilabel='', valueFontSize, showSparkLine, conditionalFormatting } = this.props;  
    const aggregation = pandasAggfunc || '';
    let resultArr = [];
    let data = this.state.data;
    let count = '';
    let rules = [];
    if(Object.keys(data).length == 0) {
      return "No data found";
    }
    data.values && data.values.length > 0 && Object.keys(data.values[0]).forEach((i, index) => { 
      let res = data.values[0][i];
      if (i !== 'bucket_kpi_all') {
        if (conditionalFormatting && conditionalFormatting.length > 0) {
          let findVal = false;
          for (let innerIndex = 0; innerIndex < conditionalFormatting.length; innerIndex++) {
            let t = conditionalFormatting[innerIndex];
            switch (t?.operator) {
              case '=':
                if (parseInt(res) == parseInt(t?.targetValue)) {
                  rules.push(t);
                  findVal = true;
                }
                break;
              case '≠':
                if (parseInt(res) != parseInt(t?.targetValue)) {
                  rules.push(t);
                  findVal = true;
                }
                break;
              case '>':
                if (parseInt(res) > parseInt(t?.targetValue)) {
                  rules.push(t);
                  findVal = true;
                }
                break;
              case '<':
                if (parseInt(res) < parseInt(t?.targetValue)) {
                  rules.push(t);
                  findVal = true;
                }
                break;
              case '≥':
                if (parseInt(res) >= parseInt(t?.targetValue)) {
                  rules.push(t);
                  findVal = true;
                }
                break;
              case '≤':
                if (parseInt(res) <= parseInt(t?.targetValue)) {
                  rules.push(t);
                  findVal = true;
                }
                break;
              case '< x <':
                if (parseInt(res) > parseInt(t?.targetValueLeft) && parseInt(res) < parseInt(t?.targetValueRight)) {
                  rules.push(t);
                  findVal = true;
                }
                break;
              case '≤ x ≤':
                if (parseInt(res) >= parseInt(t?.targetValueLeft) && parseInt(res) <= parseInt(t?.targetValueRight)) {
                  rules.push(t);
                  findVal = true;
                }
                break;
              case '≤ x <':
                if (parseInt(res) >= parseInt(t?.targetValueLeft) && parseInt(res) < parseInt(t?.targetValueRight)) {
                  rules.push(t);
                  findVal = true;
                }
                break;
              case '< x ≤':
                if (parseInt(res) > parseInt(t?.targetValueLeft) && parseInt(res) <= parseInt(t?.targetValueRight)) {
                  rules.push(t);
                  findVal = true;
                }
                break;
            }
            if (findVal === true) {
              findVal = false;
              break;
            } else if (findVal === false && conditionalFormatting.length === innerIndex + 1) {
              rules.push({});
            }
          }
        }
        if(typeof data.values[0][i] == 'number' && numberFormat) {
          res = formatNumber(numberFormat, data.values[0][i]);
          if (i !== 'All') {
            resultArr.push(_.toNumber(data.values[0][i]));
          }
        }
        if (dateFormat && i) {
          i = formatTime(dateFormat, moment(i).toDate())
        }
        tdHead.push(i);
        tdBody.push(<div className="value" style={{display: 'inline-block', fontWeight: this.props?.valueBoldText === true ? 'bolder' : '600', fontStyle: this.props?.valueItalicText === true ? 'italic' : 'normal', fontSize: _.toNumber(valueFontSize)}} dangerouslySetInnerHTML={this.createMarkup(res)} />)
        verticalData[`${i}#####******${index}`] = <div className="value" style={{display: 'inline-block', fontWeight: this.props?.valueBoldText === true ? 'bolder' : '600', fontStyle: this.props?.valueItalicText === true ? 'italic' : 'normal', fontSize: _.toNumber(valueFontSize)}} dangerouslySetInnerHTML={this.createMarkup(res)} />
      } else {
        count = data.values[0][i];
        if(typeof data.values[0][i] == 'number' && numberFormat) {
          count = formatNumber(numberFormat, data.values[0][i]);
        }
      }
    });
    let percentMetric = [];
    Object.keys(data.percentMetric).length > 0 && Object.values(data.percentMetric).forEach((value, index) => {
      Object.values(value).forEach((metric, index) => {
        percentMetric.push(<><span className="value" style={{display: 'inline-flex', color:rules[index]?.colorScheme, paddingLeft: '5px', fontStyle: this.props?.valueItalicText === true ? 'italic' : 'normal', fontWeight: 'normal', fontSize: '12px'}}>{this.iconOptions(rules[index]?.icon, rules[index]?.colorScheme)}{_.round(metric, 2)}%</span></>)
      });
    });
    Object.keys(data.percentMetric).length === 0 && rules?.length > 0 && Object.keys(data.values[0]).forEach((i, index) => {
      percentMetric.push(<><span className="value" style={{display: 'inline-flex', color:rules[index]?.colorScheme, paddingLeft: '5px', fontStyle: this.props?.valueItalicText === true ? 'italic' : 'normal', fontWeight: 'normal', fontSize: '12px'}}>{this.iconOptions(rules[index]?.icon, rules[index]?.colorScheme)}</span></>)
    });
    if (isCategory === undefined || isCategory === false) {
      tdHead.push('horizontal_separator');
      tdBody.push('horizontal_separator');
      // aggregationData['horizontal_separator'] = 'horizontal_separator';
      verticalData['horizontal_separator'] = 'horizontal_separator';
      if (count) {
        tdHead.push('All');
        tdBody.push(<div className="value" style={{display: 'inline-block', fontWeight: this.props?.valueBoldText === true ? 'bolder' : '600', fontStyle: this.props?.valueItalicText === true ? 'italic' : 'normal', fontSize: _.toNumber(valueFontSize)}} dangerouslySetInnerHTML={this.createMarkup(count)} />)
        // aggregationData[bucketkpilabel] = <div className="value" style={{fontSize: _.toNumber(valueFontSize)}} dangerouslySetInnerHTML={this.createMarkup(formatNumber(numberFormat, bucketkpivalue))} />;
        verticalData['All'] = <div className="value" style={{display: 'inline-block', fontWeight: this.props?.valueBoldText === true ? 'bolder' : '600', fontStyle: this.props?.valueItalicText === true ? 'italic' : 'normal', fontSize: _.toNumber(valueFontSize)}} dangerouslySetInnerHTML={this.createMarkup(count)} />;
      }
      if (resultArr.length > 0) {
        tdHead.push(_.startCase(_.camelCase(aggregation)));
        tdBody.push(<div className="value" style={{display: 'inline-block', fontWeight: this.props?.valueBoldText === true ? 'bolder' : '600', fontStyle: this.props?.valueItalicText === true ? 'italic' : 'normal', fontSize: _.toNumber(valueFontSize)}} dangerouslySetInnerHTML={this.createMarkup(formatNumber(numberFormat, this.getAggregationVal(resultArr, aggregation)))} />)
        // aggregationData[_.startCase(_.camelCase(aggregation))] = <div className="value" style={{fontSize: _.toNumber(valueFontSize)}} dangerouslySetInnerHTML={this.createMarkup(formatNumber(numberFormat, _.round(this.getAggregationVal(resultArr, aggregation), 2)))} />
        verticalData[_.startCase(_.camelCase(aggregation))] = <div className="value" style={{display: 'inline-block', fontWeight: this.props?.valueBoldText === true ? 'bolder' : '600', fontStyle: this.props?.valueItalicText === true ? 'italic' : 'normal', fontSize: _.toNumber(valueFontSize)}} dangerouslySetInnerHTML={this.createMarkup(formatNumber(numberFormat, this.getAggregationVal(resultArr, aggregation)))} />
      }
      let input = document.querySelector('.dashboard-chart');

      let bucketkpivalue = (this.state.bucketkpivalue === 0 || this.state.bucketkpivalue) ? this.state.bucketkpivalue : this.props.bucketkpivalue;
      if (bucketkpilabel && (bucketkpivalue === 0 || bucketkpivalue)) {
        tdHead.push(bucketkpilabel);
        if (input == null || user?.tenantKey === undefined || (roles && roles.length > 0 && user?.tenantKey && !(roles.includes('product_manager') || roles.includes('product_editor')))) {
          tdBody.push(<div className="value" style={{display: 'inline-block', fontWeight: this.props?.valueBoldText === true ? 'bolder' : '600', fontStyle: this.props?.valueItalicText === true ? 'italic' : 'normal', fontSize: _.toNumber(valueFontSize)}} dangerouslySetInnerHTML={this.createMarkup(formatNumber(numberFormat, this.props?.bucketkpivalue))} />)
        // aggregationData[bucketkpilabel] = <div className="value" style={{fontSize: _.toNumber(valueFontSize)}} dangerouslySetInnerHTML={this.createMarkup(formatNumber(numberFormat, bucketkpivalue))} />;
          verticalData[bucketkpilabel] = <div className="value" style={{display: 'inline-block', fontWeight: this.props?.valueBoldText === true ? 'bolder' : '600', fontStyle: this.props?.valueItalicText === true ? 'italic' : 'normal', fontSize: _.toNumber(valueFontSize)}} dangerouslySetInnerHTML={this.createMarkup(formatNumber(numberFormat, this.props?.bucketkpivalue))} />;
        } else {
          tdBody.push(<Popover
            title={`Edit target value`}
            content={() => (
              <Form
                onFinish={this.updateTargetValue}
                layout="vertical"
                initialValues={{'target_Value': bucketkpivalue}}
              >
                <Row gutter={12}>
                  <Col span={24}>
                    <FormItem
                      name="target_Value"
                      // initialValue={this.state.bucketkpiprevvalue}
                    >
                      <AntdInput
                        onChange={(e) => this.setState({bucketkpivalue: e.target.value ? e.target.value : 0})}
                        style={{padding: '10px'}}
                        // initialValue={this.state.bucketkpiprevvalue}
                      />
                    </FormItem>
                  </Col>
                </Row>
              <FormItem>
                <JustifyEnd>
                  <Button htmlType="button" buttonStyle="default" onClick={() => this.setState({popupVisible: false, bucketkpivalue: this.state?.bucketkpiprevvalue})}>
                    {t('Close')}
                  </Button>
                  <Button htmlType="submit" buttonStyle="primary">
                    {t('Submit')}
                  </Button>
                </JustifyEnd>
              </FormItem>
            </Form>
            )}
            trigger="click"
            placement="right"
            visible={this.state.popupVisible}
          >
            <div className="value" onClick={() => this.setState({popupVisible: true})} style={{display: 'inline-block', fontWeight: this.props?.valueBoldText === true ? 'bolder' : '600', fontStyle: this.props?.valueItalicText === true ? 'italic' : 'normal', fontSize: _.toNumber(valueFontSize)}} dangerouslySetInnerHTML={{__html: `<span>${formatNumber(numberFormat, bucketkpivalue)} 
          <i class='fa fa-edit' style='cursor: pointer'></i></span>`}} /></Popover>)
          // aggregationData[bucketkpilabel] = <div className="value" style={{fontSize: _.toNumber(valueFontSize)}} dangerouslySetInnerHTML={this.createMarkup(formatNumber(numberFormat, bucketkpivalue))} />;
          verticalData[bucketkpilabel] = <div className="value" style={{display: 'inline-block', fontWeight: this.props?.valueBoldText === true ? 'bolder' : '600', fontStyle: this.props?.valueItalicText === true ? 'italic' : 'normal', fontSize: _.toNumber(valueFontSize)}} dangerouslySetInnerHTML={this.createMarkup(formatNumber(numberFormat, this.props?.bucketkpivalue))} />;
          // tdBody.push(<AntdInput onChange={(e) => this.updateTargetValue(e)} value={bucketkpivalue} />)
          // // aggregationData[bucketkpilabel] = <div className="value" style={{fontSize: _.toNumber(valueFontSize)}} dangerouslySetInnerHTML={this.createMarkup(bucketkpivalue)} />;
          // verticalData[bucketkpilabel] = <AntdInput value={bucketkpivalue} />;
        }
      }
      if (showSparkLine && showSparkLine === true) {
        tdHead.push('custom_##_spark_line');
        // tdBody.push('custom_##_spark_line');
        verticalData['custom_##_spark_line'] = <div className="value" style={{display: 'block'}}><Sparklines data={data?.customData}><SparklinesLine color="blue" /></Sparklines></div>
      }
    }
    return {tdHead, tdBody, verticalData, aggregationData, percentMetric: percentMetric, rules: rules};
  }

  updateTargetValue = () => {
    let formData = {...this.props.chartProps.rawFormData};
    if (!user?.tenantKey) {
      this.setState({popupVisible: false, bucketkpivalue: this.state.bucketkpiprevvalue})
      return false;
    }
    let bucketKpiTenantData = formData?.tenantLevelTargetValue && (formData?.tenantLevelTargetValue).length > 0 ? [...formData?.tenantLevelTargetValue] : [];
    let hasPermission = false;
    if (roles && roles.length > 0 && (roles.includes('Admin') || (user?.tenantKey && (roles.includes('product_editor') || roles.includes('product_manager'))))) {
      hasPermission = true;
    }
    if (hasPermission === true && bucketKpiTenantData && bucketKpiTenantData.length > 0) {
      let foundTenant = false;
      bucketKpiTenantData.map((tenants, tenantIndex) => {
        if (foundTenant === false && tenants?.tenantId == user?.tenantKey && tenants?.tenantId !== 'Default Chart') {
          formData['tenantLevelTargetValue'][tenantIndex]['bucketkpivalue'] = this.state.bucketkpivalue;
          foundTenant = true;
        }
      });
      if (foundTenant === false) {
        formData['tenantLevelTargetValue'][formData['tenantLevelTargetValue'].length] = {
          bucketkpivalue: this.state.bucketkpivalue,
          bucketkpilabel: formData?.bucketkpilabel,
          tenantId: user?.tenantKey,
          email: user?.email
        }
      }
      try {
        this.props.saveSlice(formData, {
          action: 'overwrite',
          slice_id: formData.slice_id,
          slice_name: this.props?.sliceEntities?.slices?.[formData?.slice_id]?.slice_name,
          add_to_dash: 'noSave',
          goto_dash: false,
        })
        .then(({ data }) => {
          this.setState({popupVisible: false, bucketkpiprevvalue: this.state.bucketkpivalue});
          this.props.addSuccessToast('Target value updated');
          // window.location = data.slice.slice_url;
        });
      } catch (e) {
        this.props.addDangerToast('There was an error while updating the value. Please try again later');
        // alert('There was an error while updating the value. Please try again later')
      }
    }
  }

 horizontalVisualization = () => {
  let data = this.prepareData();
  if(data == 'No data found') {
    return (<NoResultsComponent
      id={this.props.chartProps.formData.sliceId || '123456789'}
      className={'superset-chart-table'}
      height={this.props.height}
      width={this.props.width}
    />)
  }
  let horizontalLabel = false;
  let horizontalLabelFlag = false;
  let horizontalValue = false;
  let horizontalValueFlag = false;
  let showGridLines = (this.props?.showGrid == true) ? {border: '1px solid #DEE4EC'} : {};
  let fixedColumnWidth = this.props?.fixedColumnWidth === true ? { tableLayout: 'fixed', wordBreak: 'break-all'} : {};
  let sparklineWidth = this.props?.fixedColumnWidth === true ? {} : {width: '100px'};
  return (
    // <div style={{ height: 'auto', overflow: 'auto'}}>
    data?.tdHead && data?.tdHead.length > 0 && <table className="kv-table" style={{...fixedColumnWidth, ...showGridLines}}>
        <tr style={showGridLines}>
        {data['tdHead'].map((keys, index) => {
          let horizontalStyle = (Object.keys(showGridLines).length === 0) ? {borderLeft: '1px solid #DEE4EC'}: {};
          return keys  !== 'horizontal_separator' ? 
          keys === 'custom_##_spark_line' ? 
          <td className="bucketkpi-data" rowSpan="2" style={{...{paddingBottom: '0', textAlign: (this.props?.labelAlignment)}, ...showGridLines, ...sparklineWidth}}>
              {/* <div className="key" style={{display: 'block', flexDirection: 'column', fontWeight: this.props?.labelBoldText === true ? 'bold' : 'normal', fontStyle: this.props?.labelItalicText === true ? 'italic' : 'normal', fontSize: _.toNumber(this.props?.labelFontSize)}}> */}
                {/* <div className="value" style={{display: 'inline-block', fontWeight: this.props?.valueBoldText === true ? 'bolder' : '600', fontStyle: this.props?.valueItalicText === true ? 'italic' : 'normal'}}> */}
                  <Sparklines data={this?.state?.data?.customData} limit={this?.state?.data?.customData.length}><SparklinesLine style={{ strokeWidth: 3, stroke: "#209AD2", fill: "#209AD2" }} color="#209AD2" /></Sparklines>
                {/* </div> */}
              {/* </div> */}
          </td>
          :
          <td className="bucketkpi-data" style={{...{paddingBottom: '0', textAlign: (this.props?.labelAlignment)}, ...showGridLines}}>
              <div className="key" style={{display: 'block', flexDirection: 'column', fontWeight: this.props?.labelBoldText === true ? 'bold' : 'normal', fontStyle: this.props?.labelItalicText === true ? 'italic' : 'normal', fontSize: _.toNumber(this.props?.labelFontSize)}}><span style={{display: 'inline-flex', alignItems: 'center'}}>{keys}{index === 0 && this.props.showSortIcons && this.props.showSortIcons === true && this.sortIcons('label')}</span></div>
          </td> : Object.keys(horizontalStyle).length > 0 && <td className="bucketkpi-data" style={{...{width: '2%', paddingBottom: '0', textAlign: (this.props?.labelAlignment)}, ...showGridLines, ...horizontalStyle}}>
              <div className="key"><span style={horizontalStyle}></span></div>
          </td>
        })}
        </tr>
        <tr style={showGridLines}>
        {data['tdBody'].map((val, index) => {
          let horizontalStyle = (Object.keys(showGridLines).length === 0) ? {borderLeft: '1px solid #DEE4EC'}: {};
          return val  !== 'horizontal_separator' ? <td className="bucketkpi-data" style={{...{paddingTop: '5px', textAlign: this.props?.valueAlignment}, ...showGridLines}}>
              <span style={{display: 'inline-flex', alignItems: 'center'}}>{val}{index === 0 && this.props.showSortIcons && this.props.showSortIcons === true && this.sortIcons('value')}</span>
              {data['percentMetric'] && data['percentMetric'][index] ? data['percentMetric'][index] : ''}
          </td> : Object.keys(horizontalStyle).length > 0 && <td className="bucketkpi-data" style={{...{width: '2%', paddingBottom: '0', textAlign: (this.props?.labelAlignment)}, ...showGridLines, ...horizontalStyle}}>
              <div className="key"><span style={horizontalStyle}></span></div>
          </td>
        })}
        </tr>
      </table>
    // </div>
  )
 }

sortByLabelOrValue = () => {
  let orderByCols = this.state.orderByCols;
  if (orderByCols !== '') {
    let groupData = JSON.parse(orderByCols);
    if (groupData[0] === this.props.groupby[0]) {
      return ['label', groupData[1]];
    } else {
      return ['value', groupData[1]];
    }
  }
  return '';
}

sortLabel = (col) => {
  let formData = {...this.props.chartProps.rawFormData};
  let label = this.sortByLabelOrValue();
  let sortOrder = '';
  if (label !== '' && label[0] === col) {
    sortOrder = label[1];
  }
  if (sortOrder === '') {
    sortOrder = true;
  } else if (sortOrder === true) {
    sortOrder = false;
  } else {
    sortOrder = '';
  }
  if (col === 'label') {
    label = this.props.groupby
  } else {
    label = this.props.metric;
    let isMetric = _.isObject(label);
    if (isMetric === true) {
      label = label?.label;
    }
  }
  if (sortOrder !== '') {
    formData.bucket_kpi_order_by_cols = `["${label}", ${sortOrder}]`;
  } else {
    delete formData.bucket_kpi_order_by_cols;
  }
  formData.row_limit = formData.row_limit;
  let input = document.querySelector('[data-test="bucket_kpi_order_by_cols"]')?.querySelector('input');
  if (input) {
    let inputValue = input.value;
    if (sortOrder !== '') {
      inputValue = `["${label}", ${sortOrder}]`;
    } else {
      inputValue = '';
    }
    updateValueByJS(input, inputValue)
  } else {
    return getChartDataRequest({
      formData: formData,
      resultFormat: 'json',
    })
    .then(({ json }) => {
      let result = json?.result[0];
      let data = result?.data;
      let orderByCols = formData?.bucket_kpi_order_by_cols;
      if (formData.bucket_kpi_order_by_cols === null || formData.bucket_kpi_order_by_cols === undefined) {
        orderByCols = '';
      }
      this.setState({data: data, orderByCols: orderByCols})
    })
  }
}

sortIcons = (label) => {
  let labelOrValue = this.sortByLabelOrValue();
  let transpose = this.props?.transposePivot && this.props?.transposePivot === true;
  let sortIcon = <Icons.Sort style={{cursor: 'pointer'}} onClick={() => this.sortLabel(label)} />;
  if (labelOrValue !== '' && labelOrValue[0] === label && labelOrValue[1] === false) {
    sortIcon = <Icons.SortDesc style={{cursor: 'pointer'}} onClick={() => this.sortLabel(label)} />;
  } else if (labelOrValue !== '' && labelOrValue[0] === label && labelOrValue[1] === true) {
    sortIcon = <Icons.SortAsc style={{cursor: 'pointer'}} onClick={() => this.sortLabel(label)} />;
  }
  return sortIcon;
}

verticalVisualization() {
  let showGridLines = (this.props?.showGrid == true) ? {border: '1px solid #DEE4EC'} : {};
  let fixedColumnWidth = this.props?.fixedColumnWidth === true ? { tableLayout: 'fixed', wordBreak: 'break-all'} : {};
  let data = this.prepareData();
  if(data == 'No data found') {
    return (<NoResultsComponent
      id={this.props.chartProps.formData.sliceId || '123456789'}
      className={'superset-chart-table'}
      height={this.props.height}
      width={this.props.width}
    />)
  }
  let res = Object.keys(data['verticalData']).map((keys, index) => {
    let actualKey = keys;
    keys = keys.split('#####******');
    if (keys && keys.length > 1) {
      keys = keys[0]
    }
    let showSortIcon = this.props.showSortIcons && this.props.showSortIcons === true;
    let sparilineFloat = this.props?.valueAlignment !== 'center'? {float: this.props?.valueAlignment}: {display: 'block', marginLeft: 'auto', marginRight: 'auto'};
    return actualKey  !== 'horizontal_separator' ?
    <>
    {index === 0 && this.props?.headerLabelName && this.props?.headerValueName &&
      <tr style={showGridLines}>
        <td className="bucketkpi-data" style={{...{padding: '5px 10px', wordBreak : 'break-all', fontSize: _.toNumber(this.props?.labelFontSize), textAlign: this.props?.labelAlignment}, ...showGridLines}}>
            <div><span className="value" style={{display: 'inline-flex', alignItems: 'center'}}>{this.props?.headerLabelName}{showSortIcon === true && this.sortIcons('label')}</span></div>
            </td>
            {this.props?.fixedColumnWidth === true && Object.keys(showGridLines).length === 0 ? 
            <td>
            <div style={{padding: '10px', color: '#fff', textAlign: 'center'}}>:</div> 
            </td>
            : Object.keys(showGridLines).length === 0 &&
            <td>
              <div style={{padding: '10px', color: '#fff'}}>:</div> 
            </td>
            }
            <td className="bucketkpi-data" style={{textAlign: 'right', fontSize: _.toNumber(this.props?.valueFontSize), textAlign: this.props?.valueAlignment}}>
            <div>
            {actualKey !== 'custom_##_spark_line' &&
              <span className="value" style={{display: 'inline-flex', alignItems: 'center'}}>{this.props?.headerValueName}{showSortIcon === true && this.sortIcons('value')}</span>
            }</div>
            </td>
      </tr>
    }
    <tr style={showGridLines}>
      <td className="bucketkpi-data" style={{...{padding: '5px 10px', wordBreak : 'break-all', fontWeight: this.props?.labelBoldText === true ? 'bold' : 'normal', fontStyle: this.props?.labelItalicText === true ? 'italic' : 'normal', fontSize: _.toNumber(this.props?.labelFontSize), textAlign: this.props?.labelAlignment}, ...showGridLines}}>
        <div>
          {actualKey === 'custom_##_spark_line' ?
          <span style={{display: 'inline-flex', alignItems: 'center', color: '#fff'}}>{keys}</span>
          :
            <span style={{display: 'inline-flex', alignItems: 'center'}}>{keys}</span>
          }
        </div>
        </td>
        {this.props?.fixedColumnWidth === true && Object.keys(showGridLines).length === 0 ? 
        <td>
          {actualKey !== 'custom_##_spark_line' && <div style={{padding: '10px', textAlign: 'center'}}>:</div>}
        </td>
        : Object.keys(showGridLines).length === 0 && 
        <td>
          {actualKey !== 'custom_##_spark_line' && <div style={{padding: '10px'}}>:</div>}
        </td>
        }
        
        <td className="bucketkpi-data" style={{textAlign: 'right', fontWeight: this.props?.valueBoldText === true ? 'bolder' : 'normal', fontStyle: this.props?.valueItalicText === true ? 'italic' : 'normal', fontSize: _.toNumber(this.props?.valueFontSize), textAlign: this.props?.valueAlignment, paddingRight: this.props?.valueAlignment === 'right' && showSortIcon === true ? '20px': '10px'}}>
          {actualKey !== 'custom_##_spark_line' ?
          <div>
            <span style={{display: 'inline-flex', alignItems: 'center'}}>{data['verticalData'][actualKey]}
            </span>
            {data['percentMetric'] && data['percentMetric'][index] ? data['percentMetric'][index] : ''}
            </div>
            : <div style={{width: '100px', ...sparilineFloat}}>{data['verticalData'][actualKey]}</div>
          }
        </td>
    </tr></> : Object.keys(showGridLines).length === 0 && <tr style={{borderBottom: '1px solid #DEE4EC', padding: '5px 10px'}}><td className="bucketkpi-data" style={{padding: '5px 10px'}}><div className="key"></div></td></tr>
  })
  return (
    <div style={{ height: this.props?.height, overflow: 'auto'}}>
      <table className="kv-table" style={{...fixedColumnWidth, ...showGridLines}}>
        {res}
      </table>
    </div>
  )
}

  render() {
    return(
      this.props?.transposePivot && this.props.transposePivot === true ? this.verticalVisualization() : this.horizontalVisualization()
    )
  }
}

const mapStateToProps = (state, ownProps = {}) => {
  return {
    sliceEntities : state?.sliceEntities
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    saveSlice: (formData, params) => dispatch(saveSlice(formData, params)),
    addSuccessToast: (text) => dispatch(addSuccessToast(text)),
    addDangerToast: (text) => dispatch(addDangerToast(text)),
    dispatch,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BucketKPI);
