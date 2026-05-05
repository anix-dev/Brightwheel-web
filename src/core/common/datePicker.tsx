import React, { useEffect, useState } from 'react';
import { DateRangePicker } from 'react-bootstrap-daterangepicker';
import moment from 'moment';
import 'bootstrap-daterangepicker/daterangepicker.css';

interface Props {
  onDateChange: (start: string, end: string) => void;
}

const PredefinedDateRanges: React.FC<Props> = ({ onDateChange }) => {
  const [state, setState] = useState({
    start: moment().subtract(29, 'days'),
    end: moment(),
  });

  const [label, setLabel] = useState(
    `${state.start.format('D MMMM, YYYY')} - ${state.end.format('D MMMM, YYYY')}`
  );

  const handleApply = (event: any, picker: any) => {
    const start = moment(picker.startDate);
    const end = moment(picker.endDate);
    setState({ start, end });

    // Update label and notify parent
    const newLabel = `${start.format('D MMMM, YYYY')} - ${end.format('D MMMM, YYYY')}`;
    setLabel(newLabel);
    onDateChange(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
  };
  useEffect(() => {
    onDateChange(state.start.format('YYYY-MM-DD'), state.end.format('YYYY-MM-DD'));
  }, []);
  return (
    <DateRangePicker
      initialSettings={{
        startDate: state.start.toDate(),
        endDate: state.end.toDate(),
        autoUpdateInput: false,
        ranges: {
          Today: [moment().toDate(), moment().toDate()],
          Yesterday: [moment().subtract(1, 'days').toDate(), moment().subtract(1, 'days').toDate()],
          'Last 7 Days': [moment().subtract(6, 'days').toDate(), moment().toDate()],
          'Last 30 Days': [moment().subtract(29, 'days').toDate(), moment().toDate()],
          'This Month': [moment().startOf('month').toDate(), moment().endOf('month').toDate()],
          'Last Month': [
            moment().subtract(1, 'month').startOf('month').toDate(),
            moment().subtract(1, 'month').endOf('month').toDate(),
          ],
        },
      }}
      onApply={handleApply}
    >
      <div
        id="reportrange"
        className="col-4"
        style={{
          background: '#fff',
          cursor: 'pointer',
          padding: '0.5rem 0.625rem',
          border: '1px solid #E9EDF4',
          width: '100%',
          borderRadius: '5px',
          fontSize: '14px',
          color: '#202C4B',
          height: '38px',
        }}
      >
        <i className="ti ti-calendar"></i>&nbsp;
        <span>{label}</span>
      </div>
    </DateRangePicker>
  );
};

export default PredefinedDateRanges;
