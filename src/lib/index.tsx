import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import flatpickr from 'flatpickr';

interface ReactFlatpickrProps {
  options?: flatpickr.Options.Options;
  value?: string | Date | number | (string | Date | number)[];
  defaultValue?: string;
  children?: React.ReactNode;
  className?: string;
  placeholder?: string;
  id?: string;
  onCreate?: (instance: flatpickr.Instance) => void;
  onDestroy?: (instance: flatpickr.Instance) => void;
  onChange?: flatpickr.Options.Options['onChange'];
  onOpen?: flatpickr.Options.Options['onOpen'];
  onClose?: flatpickr.Options.Options['onClose'];
  onMonthChange?: flatpickr.Options.Options['onMonthChange'];
  onYearChange?: flatpickr.Options.Options['onYearChange'];
  onReady?: flatpickr.Options.Options['onReady'];
  onValueUpdate?: flatpickr.Options.Options['onValueUpdate'];
  onDayCreate?: flatpickr.Options.Options['onDayCreate'];
  render?: (
    props: Omit<
      ReactFlatpickrProps,
      | 'options'
      | 'children'
      | 'onCreate'
      | 'onDestroy'
      | 'onChange'
      | 'onOpen'
      | 'onClose'
      | 'onMonthChange'
      | 'onYearChange'
      | 'onReady'
      | 'onValueUpdate'
      | 'onDayCreate'
      | 'render'
    >,
    ref: React.RefObject<HTMLInputElement | null>
  ) => React.ReactNode;
}

export type { ReactFlatpickrProps };

const ReactFlatpickr: React.FC<ReactFlatpickrProps> = ({
  options = {},
  value,
  defaultValue,
  children,
  className,
  onCreate,
  onDestroy,
  onChange,
  onOpen,
  onClose,
  onMonthChange,
  onYearChange,
  onReady,
  onValueUpdate,
  onDayCreate,
  render,
  id,
  placeholder,
  ...restProps
}) => {
  const nodeRef = useRef(null);
  const instanceRef = useRef<flatpickr.Instance>(null);

  const opts = useMemo(
    () => ({
      ...options,
      onChange,
      onOpen,
      onClose,
      onMonthChange,
      onYearChange,
      onReady,
      onValueUpdate,
      onDayCreate
    }),
    [options, onChange, onOpen, onClose, onMonthChange, onYearChange, onReady, onValueUpdate, onDayCreate]
  );

  const createFlatpickrInstance = useCallback(() => {
    if (!nodeRef?.current) return;

    instanceRef.current = flatpickr(nodeRef.current, opts);

    if (value !== undefined) {
      instanceRef.current.setDate(value, false);
    }

    if (onCreate) {
      onCreate(instanceRef.current);
    }
  }, [opts, value, onCreate]);

  const destroyFlatpickrInstance = useCallback(() => {
    if (!instanceRef.current) return;

    if (onDestroy) {
      onDestroy(instanceRef.current);
    }

    instanceRef.current.destroy();
    instanceRef.current = null;
  }, [onDestroy]);

  useEffect(() => {
    createFlatpickrInstance();

    return () => {
      destroyFlatpickrInstance();
    };
    // INFO: To prevent unnecessary rerender
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateFlatpickrInstance = useCallback(() => {
    const optionsKeys = Object.keys(opts) as (keyof flatpickr.Options.Options)[];

    optionsKeys.forEach((key) => {
      const val = opts[key];
      if (val !== instanceRef.current?.config[key]) {
        instanceRef.current?.set(key, val);
      }
    });

    if (value !== undefined && value !== instanceRef.current?.input.value) {
      instanceRef.current?.setDate(value, false);
    }
  }, [opts, value]);

  useEffect(() => {
    if (instanceRef.current) {
      updateFlatpickrInstance();
    }
  }, [options, updateFlatpickrInstance]);

  if (render) {
    return render({ value, defaultValue, placeholder, id, ...restProps }, nodeRef);
  }

  return options?.wrap ? (
    <div ref={nodeRef} className={className}>
      {children}
    </div>
  ) : (
    <input ref={nodeRef} defaultValue={defaultValue} placeholder={placeholder} className={className} />
  );
};

export default ReactFlatpickr;
