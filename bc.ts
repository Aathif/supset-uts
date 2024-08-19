import React from 'react';
 import PropTypes from 'prop-types';
 import { Row, Col, AntdInput, AntdSwitch, AntdCheckbox } from 'src/components';
 import { Form, FormItem } from 'src/components/Form';
 import Button from 'src/components/Button';
 import {
   styled,
   t,
 } from '@superset-ui/core';
 
 import Modal from 'src/components/Modal';
 import withToasts from 'src/components/MessageToasts/withToasts';
 


 class FilterNewScheme extends React.PureComponent {
   constructor(props) {
     super(props);
     this.state = {
         filterVal : {
            name: '',
            public: false,
            default: false
         }
     };
   }

   onChange = (e, type) => {
    let filterVal = {...this.state.filterVal}
    if (type === 'name') {
        filterVal[type] = e.target.value;
    } else if (type === 'public') {
        filterVal[type] = e;
    } else {
        filterVal[type] = e.target?.checked;
    }
    this.setState({filterVal});
   }

   render() {
     return (
       <Modal
         show={this.props.show}
         onHide={this.props.onHide}
         title={t('Save Filter Scheme')}
         width="35%"
         footer={
           <>
             <Button
               htmlType="button"
               buttonSize="small"
               onClick={this.props.onHide}
               data-test="properties-modal-cancel-button"
             >
               {t('Cancel')}
             </Button>
             <Button
               onClick={() => this.props.preparePayloadFilter(this.state.filterVal)}
               buttonSize="small"
               buttonStyle="primary"
               className="m-r-5"
             >
               {t('Save')}
             </Button>
           </>
         }
         responsive
       >
         <Form
           data-test="dashboard-edit-properties-form"
        //    onSubmit={this.props.preparePayloadFilter(this.state.filterVal)}
           layout="vertical"
         >
           {/* <Row>
             <Col xs={24} md={24}>
               <h3>{t('Save Filter Scheme')}</h3>
             </Col>
           </Row> */}
           <Row gutter={16}>
             <Col xs={24} md={24}>
               <FormItem label={t('Filter Name')}>
                 <AntdInput
                   data-test="dashboard-title-input"
                   name="name"
                   type="text"
                   value={this.state?.filterVal?.name || ''}
                   onChange={(e) => this.onChange(e, 'name')}
                 />
               </FormItem>
             </Col>
           </Row>
           <Row gutter={16}>
             <Col xs={24} md={24}>
               <FormItem label={t('Make as Default Filter Scheme')}>
               <AntdCheckbox style={{}} checked={this.state?.filterVal?.default === false ? false : true} onChange={(e) => this.onChange(e, 'default')} />
               </FormItem>
             </Col>
           </Row>
         </Form>
       </Modal>
     );
   }
 }
 
 
 export default withToasts(FilterNewScheme);
