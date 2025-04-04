# React Flatpickr

A flexible and reusable React wrapper component for the [flatpickr](https://flatpickr.js.org/) date picker library.

Inspired by [react-flatpickr](https://github.com/haoxins/react-flatpickr), but written from scratch.

## Support me
If you like what I'm doing, support me: https://ko-fi.com/mykeshato

## Installation

```bash
npm install react-flatpickr-wrapper flatpickr
# or
yarn add react-flatpickr-wrapper flatpickr
```

## Usage

### Basic Usage

```js
import React, { useState } from 'react';
import ReactFlatpickr from './ReactFlatpickr';
import 'flatpickr/dist/flatpickr.css'; // Import flatpickr styles from flatpickr repository

const DatePickerExample: React.FC = () => {
  const [date, setDate] = useState<Date | null>(null);

  return (
    <ReactFlatpickr
      value={date}
      onChange={(selectedDates) => {
        setDate(selectedDates[0]);
      }}
      placeholder="Select a date..."
    />
  );
};

export default DatePickerExample;
```

### With Options

```js
import React, { useState } from 'react';
import ReactFlatpickr from './ReactFlatpickr';
import 'flatpickr/dist/flatpickr.css';

const AdvancedDatePickerExample: React.FC = () => {
  const [date, setDate] = useState<Date>(new Date());

  return (
    <ReactFlatpickr
      value={date}
      options={{
        mode: 'range',
        dateFormat: 'Y-m-d',
        allowInput: true,
        minDate: 'today',
        maxDate: new Date().fp_incr(30), // 30 days from now
        disable: [
          function(date) {
            // Return true to disable Saturdays and Sundays
            return date.getDay() === 0 || date.getDay() === 6;
          }
        ]
      }}
      onChange={(selectedDates) => {
        setDate(selectedDates[0]);
      }}
    />
  );
};
```

### Custom Render

```js
import React, { useState } from 'react';
import ReactFlatpickr from './ReactFlatpickr';
import 'flatpickr/dist/flatpickr.css';

const CustomRenderExample: React.FC = () => {
  const [date, setDate] = useState<Date | null>(null);

  return (
    <ReactFlatpickr
      value={date}
      onChange={(selectedDates) => {
        setDate(selectedDates[0]);
      }}
      render={(props, ref) => (
        <div className="custom-datepicker-container">
          <label htmlFor="custom-datepicker">Select Date:</label>
          <input
            id="custom-datepicker"
            ref={ref}
            className="custom-datepicker"
            placeholder={props.placeholder || "YYYY-MM-DD"}
            {...props}
          />
          <button type="button" onClick={() => setDate(null)}>Clear</button>
        </div>
      )}
    />
  );
};
```

### With Children (Wrapped Mode)

```js
import React, { useState } from 'react';
import ReactFlatpickr from './ReactFlatpickr';
import 'flatpickr/dist/flatpickr.css';

const WrappedExample: React.FC = () => {
  const [date, setDate] = useState<Date | null>(null);

  return (
    <ReactFlatpickr
      value={date}
      options={{
        wrap: true,
        dateFormat: 'Y-m-d',
      }}
      onChange={(selectedDates) => {
        setDate(selectedDates[0]);
      }}
    >
      <input
        type="text"
        placeholder="Select date..."
        data-input
      />
      <button type="button" data-toggle>📅</button>
      <button type="button" data-clear>❌</button>
    </ReactFlatpickr>
  );
};
```

## Props

| Prop            | Type                                                       | Description                                                |
| --------------- | ---------------------------------------------------------- | ---------------------------------------------------------- |
| `options`       | `flatpickr.Options.Options`                                | Flatpickr configuration options                            |
| `value`         | `string \| Date \| number \| (string \| Date \| number)[]` | Current value(s) of the date picker                        |
| `defaultValue`  | `string`                                                   | Default value for the input field                          |
| `children`      | `React.ReactNode`                                          | Children elements (used with wrap mode)                    |
| `className`     | `string`                                                   | CSS class for the input element or wrapper                 |
| `placeholder`   | `string`                                                   | Placeholder text for the input                             |
| `id`            | `string`                                                   | ID attribute for the input element                         |
| `onCreate`      | `(instance: flatpickr.Instance) => void`                   | Called when flatpickr instance is created                  |
| `onDestroy`     | `(instance: flatpickr.Instance) => void`                   | Called before flatpickr instance is destroyed              |
| `onChange`      | `flatpickr.Options.Options['onChange']`                    | Called when the user selects a date                        |
| `onOpen`        | `flatpickr.Options.Options['onOpen']`                      | Called when the calendar is opened                         |
| `onClose`       | `flatpickr.Options.Options['onClose']`                     | Called when the calendar is closed                         |
| `onMonthChange` | `flatpickr.Options.Options['onMonthChange']`               | Called when the month is changed                           |
| `onYearChange`  | `flatpickr.Options.Options['onYearChange']`                | Called when the year is changed                            |
| `onReady`       | `flatpickr.Options.Options['onReady']`                     | Called when the calendar is ready                          |
| `onValueUpdate` | `flatpickr.Options.Options['onValueUpdate']`               | Called when the value is updated                           |
| `onDayCreate`   | `flatpickr.Options.Options['onDayCreate']`                 | Called when a day is created                               |
| `render`        | `(props, ref) => React.ReactNode`                          | Custom render function for complete control over rendering |

## Event Handlers

All flatpickr event handlers are supported through both direct props and the `options` object. When provided as direct props, they take precedence over handlers defined in the `options` object.

```js
<ReactFlatpickr
  onChange={(selectedDates, dateStr, instance) => {
    console.log('Selected dates:', selectedDates);
    console.log('Date string:', dateStr);
    console.log('Flatpickr instance:', instance);
  }}
  onOpen={(selectedDates, dateStr, instance) => {
    console.log('Calendar opened');
  }}
  onClose={(selectedDates, dateStr, instance) => {
    console.log('Calendar closed');
  }}
/>
```

## Custom Rendering

The `render` prop provides complete control over the rendered output while maintaining the flatpickr functionality:

```js
<ReactFlatpickr
  value={date}
  onChange={handleDateChange}
  render={(props, ref) => (
    <div className="date-picker-container">
      <div className="input-group">
        <span className="input-group-text">📅</span>
        <input ref={ref} type="text" className="form-control" placeholder="Select a date" {...props} />
      </div>
    </div>
  )}
/>
```

## Advanced Configuration

### Multiple Dates

```js
import React, { useState } from 'react';
import ReactFlatpickr from './ReactFlatpickr';
import 'flatpickr/dist/flatpickr.css';

const MultipleDatesExample: React.FC = () => {
  const [dates, setDates] = useState<Date[]>([]);

  return (
    <ReactFlatpickr
      value={dates}
      options={{
        mode: 'multiple',
        dateFormat: 'Y-m-d',
        conjunction: ', '
      }}
      onChange={(selectedDates) => {
        setDates(selectedDates);
      }}
      placeholder="Select multiple dates..."
    />
  );
};
```

### Time Picker

```js
import React, { useState } from 'react';
import ReactFlatpickr from './ReactFlatpickr';
import 'flatpickr/dist/flatpickr.css';

const TimePickerExample: React.FC = () => {
  const [time, setTime] = useState<Date | null>(null);

  return (
    <ReactFlatpickr
      value={time}
      options={{
        enableTime: true,
        noCalendar: true,
        dateFormat: 'H:i',
        time_24hr: true
      }}
      onChange={(selectedDates) => {
        setTime(selectedDates[0]);
      }}
      placeholder="Select time..."
    />
  );
};
```

## Working with Refs

```js
import React, { useRef } from 'react';
import ReactFlatpickr from './ReactFlatpickr';
import 'flatpickr/dist/flatpickr.css';

const RefExample: React.FC = () => {
  const flatpickrInstance = useRef<flatpickr.Instance | null>(null);

  const handleCreate = (instance: flatpickr.Instance) => {
    flatpickrInstance.current = instance;
  };

  const openCalendar = () => {
    flatpickrInstance.current?.open();
  };

  const clearSelection = () => {
    flatpickrInstance.current?.clear();
  };

  return (
    <div>
      <ReactFlatpickr
        onCreate={handleCreate}
        placeholder="Select a date..."
      />
      <button onClick={openCalendar}>Open Calendar</button>
      <button onClick={clearSelection}>Clear</button>
    </div>
  );
};
```

## License

MIT © [MikeSha](https://github.com/MikeSha)
