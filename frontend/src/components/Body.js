import React from 'react';

// Import third party components.
import CsvDownload from 'react-json-to-csv';
import { DataGrid } from '@material-ui/data-grid';

// Import style sheets.
import '../styles/Downloadbutton.css'

/* Body which fetches a JSON from a Flask API, renders the result
as a table, offers to download this table as a .csv file, and offers to
calculate the mean of the price information in the data. */
export class Body extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            data_from_api : null
        };
    };


    async componentDidMount() {
        const url = this.props.data_source;
        const response = await fetch(url);
        const data = await response.json();
        this.setState({ data_from_api: data, loading: false });
    };


    helpExtractDictValues(data, attribute) {
        var extract = [];
        for (let key in data) {
            extract.push(data[key][attribute])
        };

        return extract
    };


    helpCountValues(data) {
        var count_dict = {};
        let unique_values = [...new Set(data)]
        for (let uval in unique_values) {
        let entity = unique_values[uval];
        count_dict[entity] = data.filter(function(value) { return value === entity }).length;
        };

        var count_dict_values = [];
        for (let ucv in count_dict) {
        count_dict_values.push(count_dict[ucv])
        };

        return {
            dict: count_dict,
            values: count_dict_values
        }
    }


    getCount(data) {
        return data.length
    };


    getAverage(...args) {
        let count = this.getCount(...args);
        let values = this.helpExtractDictValues(...args);
        var average = values.reduce((previous, current) => current += previous) / count;

        return average
    };


    getMedian(...args) {
        let count = this.getCount(...args);
        let values = this.helpExtractDictValues(...args);

        let check_even = count % 2;
        if (check_even === 0) {
            let left = (count / 2) - 1;
            let right = left + 1;
            var median = (values[left] + values[right]) / 2;
        } else {
            var median = (values[Math.floor(count / 2)]);
        };

        return median
    };


    getMode(...args) {
        let count = this.getCount(...args);
        let values = this.helpExtractDictValues(...args);

        let check_unique_values = [...new Set(values)];
        if (check_unique_values.length === count) {
            let mode_value = null;
            let mode = null;
            var result = null;
        } else {
            let helper_result = this.helpCountValues(values);
            let counts = helper_result.dict;
            let counts_values = helper_result.values;

            // Check if multiple modes.
            let helper_result_check = this.helpCountValues(counts_values);
            let counts_check = helper_result_check.dict;
            let counts_values_check = helper_result_check.values;

            // Get the value of the mode.
            let mode_value = Math.max(...counts_values);

            if (counts_values_check.length > 1) {
            let modes_dict = Object.fromEntries(Object.entries(counts).filter(([k,v]) => v===mode_value));
            var result = [];
            for (let ucmv in modes_dict) {
            result.push(ucmv, ' (n=', modes_dict[ucmv].toString(), ')')
            };
            result = result.join('');
            result = result.replace(/[)](?=.*[)])/g, "), ");
            } else {
            let mode_value_index = counts_values.indexOf(mode_value);
            let mode = Object.keys(counts)[mode_value_index];
            var result = mode.concat(' (n=', mode_value.toString(), ')');
            };
        };

        return result
    };


    getTable() {
        const attribute_names = Object.keys(this.state.data_from_api[0]);

        var columns = [];
        for (let j in attribute_names) {
        columns.push({
           field: attribute_names[j],
           headerName: attribute_names[j],
           width : 150
           })
        };

        var rows = [];
        for (let i in this.state.data_from_api) {
        rows.push(this.state.data_from_api[i])
        };
        rows = rows.slice(0, 3);

        return(
              <DataGrid rows={rows} columns={columns} pageSize={5} checkboxSelection />
          );
    };


    render() {
        return (
            <div>
                { this.state.loading || !this.state.data_from_api ? (
                    <div>No Flask API...</div>
                ) : (
                    <div>
                        <div style={{ height: 400, width: '100%' }}>
                            { this.getTable() }
                        </div>
                        <div className="download-button">
                            <CsvDownload data={ this.state.data_from_api } filename={ this.props.csv_file_name }/>
                        </div>
                        <div>
                            <h3>Descriptive statistics</h3>
                            <p>COUNT: { this.getCount(this.state.data_from_api) }</p>
                            <p>MEAN-{ this.props.price_attribute_name }: { this.getAverage(this.state.data_from_api,
                                                                                           this.props.price_attribute_name) }</p>
                            <p>MEDIAN-{ this.props.price_attribute_name }: { this.getMedian(this.state.data_from_api,
                                                                                            this.props.price_attribute_name) }</p>
                            <p>MODE-{ this.props.brand_attribute_name }: { this.getMode(this.state.data_from_api,
                                                                                        this.props.brand_attribute_name) }</p>
                        </div>
                    </div>
                )}
            </div>
        );
    }
};