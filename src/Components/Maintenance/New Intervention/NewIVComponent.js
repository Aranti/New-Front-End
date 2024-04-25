import React from 'react';
import moment from 'moment';
import '../../../../public/CommonCss/intervention.css';
import DatesComponent from './DatesComponent';
import InterventionDetails from './InterventionDetails';
import JobComponent from './JobComponent';
import EquipmentComponent from './EquipmentComponent';
import HeaderComponent from '../../HeaderComponent';
import { Button } from 'react-bootstrap';
import { setFromDate, setToDate, setIVCategory,
    setCategoryCode, setCategoryDescription, setInterventionType,
    setLocation, setJobList, setEquipmentList
} from '../../../redux/ActionCreators';
import { connect } from 'react-redux';

const mapStateToProps = state => {
    return {
        create_iv: state.create_iv
    }
}

const mapDispatchToProps = (dispatch) => ({
    setFromDate: (input) => { dispatch(setFromDate(input)) },
    setToDate: (input) => { dispatch(setToDate(input)) },
    setIVCategory: (input) => { dispatch(setIVCategory(input)) },
    setCategoryCode: (input) => { dispatch(setCategoryCode(input)) },
    setCategoryDescription: (input) => { dispatch(setCategoryDescription(input)) },
    setInterventionType: (input) => { dispatch(setInterventionType(input)) },
    setLocation: (input) => { dispatch(setLocation(input)) },
    setJobList: (input) => { dispatch(setJobList(input)) },
    setEquipmentList: (input) => { dispatch(setEquipmentList(input)) },
})


class NewIVComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            step: 1,
            fromDate: '',
            toDate: '',
            iv_category: '',
            category_code: '',
            category_desc: '',
            iv_type: '',
            location: '',
            jobFromDate: '',
            jobToDate: '',
            job_code: '',
            equip_desc: '',
            equip_code: '',
            job_list: [{'jobFromDate': null, 'jobToDate': null, 'job_code': ''}],
            equipment_list: [{'equip_desc': '', 'equip_code': '', 'job_code': ''}]
        }

        this.goBack = this.goBack.bind(this);
        this.goForward = this.goForward.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeForDynamics = this.handleChangeForDynamics.bind(this);
        this.handleAddClick = this.handleAddClick.bind(this);
        this.handleRemoveClick = this.handleRemoveClick.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidUpdate (prevState, prevProps) {
        if(prevState.job_list !== this.state.job_list) {
            console.log(this.state.job_list);
        }
    }

    goBack = () => {
        const { step } = this.state;
        this.setState({
            step: step - 1
        });
    }

    goForward = () => {
        const { step } = this.state;
        this.setState({
            step: step + 1
        });
    }

    handleChange = (input, e) => {
        if(input.includes('Date')) {
            this.setState({
                [input]: e
            });
            if(input.includes('from')) {
                this.props.setFromDate(moment(e).format('YYYY-MM-DD'));
            }
            else {
                this.props.setToDate(moment(e).format('YYYY-MM-DD'));
            }
        }
        else {
            try {
                this.setState({
                    [input]: e.target.value
                });

                if(input === 'location') {
                    this.props.setLocation(e.target.value)
                }
            }
            catch(err) {
                this.setState({
                    [input]: e
                });

                if(input === 'iv_category') {
                    this.props.setIVCategory(e.value)
                }
                else if(input === 'category_code') {
                    this.props.setCategoryCode(e.value)
                }
                else if(input === 'category_desc') {
                    this.props.setCategoryDescription(e.value)
                }
                else if(input === 'iv_type') {
                    this.props.setInterventionType(e.value)
                }
            }
            
        }
        // this.setState({
        //     [input]: e.target.value
        // });
    }

    handleChangeForDynamics = (listName, input, e, index) => {
        const list = [...this.state[listName]];
        if(input.includes('Date')) {
            list[index][input] = e
        }
        else {
            try {
                list[index][input] = e.target.value
            }
            catch(err) {
                list[index][input] = e
            }
        }

        this.setState({
            [listName]: list
        });

        if(listName === 'job_list') {
            // let new_list = list;
            // new_list[index][input] = moment(e).format('YYYY-MM-DD')
            this.props.setJobList(list);
        }
        else {
            this.props.setEquipmentList(list);
        }
    }

    handleRemoveClick = (listName, index) => {
        const list = [...this.state[listName]];
        list.splice(index, 1);
        this.setState({
            [listName]: list
        })

        if(listName === 'job_list') {
            this.props.setJobList(list);
        }
        else {
            this.props.setEquipmentList(list);
        }
    }

    handleAddClick = (listName) => {
        if(listName.includes('job')) {
            this.setState({
                [listName]: [...this.state[listName], {'jobFromDate': null, 'jobToDate': null, 'job_code': ''}]
            })
        }
        else {
            this.setState({
                [listName]: [...this.state[listName], {'equip_desc': '', 'equip_code': '', 'job_code': ''}]
            })
        }
        
    }

    handleSubmit = () => {
        let intervention_data = {};
        let new_job_list = [];
        let new_equipment_list = [];
        const job_list = [...this.props.create_iv.job_list];
        const equipment_list = [...this.props.create_iv.equipment_list];

        let category_code = this.props.create_iv.category_code;
        let category_description = this.props.create_iv.category_desc
        let iv_category = this.props.create_iv.iv_category
        let iv_type = this.props.create_iv.iv_type
        let location = this.props.create_iv.location
        let fromDate = this.props.create_iv.fromDate
        let toDate = this.props.create_iv.toDate

        for(let i=0;i<job_list.length;i++) {
            let new_job_code = job_list[i]['job_code']['value']
            let tempDict = {
                'jobFromDate': moment(job_list[i]['jobFromDate']).format("YYYY-MM-DD"),
                'jobToDate': moment(job_list[i]['jobToDate']).format("YYYY-MM-DD"),
                'job_code': new_job_code
            }
            new_job_list.push(tempDict)
        }

        for(let i=0;i<equipment_list.length;i++) {
            let new_equipment_code = equipment_list[i]['equip_code']['value']
            let new_job_code = equipment_list[i]['job_code']['value']
            let tempDict = {
                'equip_desc': equipment_list[i]['equip_desc'],
                'equip_code': new_equipment_code,
                'job_code': new_job_code
            }
            new_equipment_list.push(tempDict)
        }

        
        intervention_data = {
            'fromDate': fromDate,
            'toDate': toDate,
            'iv_category': iv_category,
            'category_code': category_code,
            'category_description': category_description,
            'iv_type': iv_type,
            'location': location,
            'jobs': new_job_list,
            'equipments': new_equipment_list
        }

        console.log(intervention_data);

    }

    render() {
        const { step } = this.state;
        const { fromDate, toDate, iv_category, category_code, category_desc, iv_type, location,
            jobFromDate, jobToDate, job_code, equip_desc, equip_code, job_list, equipment_list
        } = this.state;
        const values = { fromDate, toDate, iv_category, category_code, category_desc, iv_type, location,
            jobFromDate, jobToDate, job_code, equip_desc, equip_code, job_list, equipment_list
        };

        return (
            <>
                <HeaderComponent isOverview={false} />
                <div className='interventioncard'>
                    <div>
                        {
                            step === 1 ?
                                <DatesComponent
                                    goForward={this.goForward}
                                    handleChange={this.handleChange}
                                    values={ values }
                                />
                            : step === 2 ?
                                <InterventionDetails
                                    goBack={this.goBack}
                                    goForward={this.goForward}
                                    handleChange={this.handleChange}
                                    values={ values }
                                />
                            : step === 3 ? 
                                <JobComponent
                                    goBack={this.goBack}
                                    goForward={this.goForward}
                                    handleChange={this.handleChangeForDynamics}
                                    handleAddClick={this.handleAddClick}
                                    handleRemoveClick={this.handleRemoveClick}
                                    values={ values }
                                />
                            : step === 4 ?
                                <EquipmentComponent
                                    goBack={this.goBack}
                                    handleChange={this.handleChangeForDynamics}
                                    handleAddClick={this.handleAddClick}
                                    handleRemoveClick={this.handleRemoveClick}
                                    values={ values }
                                />
                            : ""
                            
                        }
                    </div>
                    {
                        step === 4 ? 
                            <Button variant="outline-primary" className="nextbutton" onClick={this.handleSubmit}>Submit</Button>
                        :
                            <Button variant="outline-primary" className="nextbutton" disabled={true}>Submit</Button>
                    }
                </div>
            </>
        )

        
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewIVComponent);