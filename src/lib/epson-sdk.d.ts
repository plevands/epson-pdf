/**
 * TypeScript declarations for Epson ePOS SDK (epos-2.27.0.js)
 */

declare global {
  interface Window {
    epson: typeof epson;
  }
}

declare namespace epson {
  // ePOSBuilder - Build print commands
  class ePOSBuilder {
    message: string;
    halftone: number;
    brightness: number;
    force: boolean;

    // Halftone constants
    HALFTONE_DITHER: 0;
    HALFTONE_ERROR_DIFFUSION: 1;
    HALFTONE_THRESHOLD: 2;

    // Mode constants
    MODE_MONO: 'mono';
    MODE_GRAY16: 'gray16';

    // Alignment constants
    ALIGN_LEFT: 'left';
    ALIGN_CENTER: 'center';
    ALIGN_RIGHT: 'right';

    // Color constants
    COLOR_NONE: 'none';
    COLOR_1: 'color_1';
    COLOR_2: 'color_2';
    COLOR_3: 'color_3';
    COLOR_4: 'color_4';

    // Cut constants
    CUT_NO_FEED: 'no_feed';
    CUT_FEED: 'feed';
    CUT_RESERVE: 'reserve';

    // Font constants
    FONT_A: 'font_a';
    FONT_B: 'font_b';
    FONT_C: 'font_c';

    // Feed position constants
    FEED_PEELING: 'peeling';
    FEED_CUTTING: 'cutting';
    FEED_CURRENT_TOF: 'current_tof';
    FEED_NEXT_TOF: 'next_tof';

    // Barcode types
    BARCODE_UPC_A: 'upc_a';
    BARCODE_UPC_E: 'upc_e';
    BARCODE_EAN13: 'ean13';
    BARCODE_JAN13: 'jan13';
    BARCODE_EAN8: 'ean8';
    BARCODE_JAN8: 'jan8';
    BARCODE_CODE39: 'code39';
    BARCODE_ITF: 'itf';
    BARCODE_CODABAR: 'codabar';
    BARCODE_CODE93: 'code93';
    BARCODE_CODE128: 'code128';
    BARCODE_GS1_128: 'gs1_128';

    // Symbol types
    SYMBOL_QRCODE_MODEL_1: 'qrcode_model_1';
    SYMBOL_QRCODE_MODEL_2: 'qrcode_model_2';
    SYMBOL_QRCODE_MICRO: 'qrcode_micro';
    SYMBOL_PDF417_STANDARD: 'pdf417_standard';
    SYMBOL_PDF417_TRUNCATED: 'pdf417_truncated';

    // Level constants
    LEVEL_L: 'level_l';
    LEVEL_M: 'level_m';
    LEVEL_Q: 'level_q';
    LEVEL_H: 'level_h';
    LEVEL_DEFAULT: 'default';

    // HRI constants
    HRI_NONE: 'none';
    HRI_ABOVE: 'above';
    HRI_BELOW: 'below';
    HRI_BOTH: 'both';

    constructor();

    // Text methods
    addText(text: string): this;
    addTextLang(lang: string): this;
    addTextAlign(align: 'left' | 'center' | 'right'): this;
    addTextRotate(rotate: boolean): this;
    addTextLineSpace(linespc: number): this;
    addTextFont(font: 'font_a' | 'font_b' | 'font_c' | 'font_d' | 'font_e' | 'special_a' | 'special_b'): this;
    addTextSmooth(smooth: boolean): this;
    addTextDouble(dw?: boolean, dh?: boolean): this;
    addTextSize(width: number, height: number): this;
    addTextStyle(reverse?: boolean, ul?: boolean, em?: boolean, color?: 'none' | 'color_1' | 'color_2' | 'color_3' | 'color_4'): this;
    addTextPosition(x: number): this;
    addTextVPosition(y: number): this;

    // Feed methods
    addFeed(): this;
    addFeedUnit(unit: number): this;
    addFeedLine(line: number): this;
    addFeedPosition(pos: 'peeling' | 'cutting' | 'current_tof' | 'next_tof'): this;

    // Image method - takes Canvas 2D context
    addImage(
      context: CanvasRenderingContext2D,
      x: number,
      y: number,
      width: number,
      height: number,
      color?: 'none' | 'color_1' | 'color_2' | 'color_3' | 'color_4',
      mode?: 'mono' | 'gray16'
    ): this;

    // Logo method
    addLogo(key1: number, key2: number): this;

    // Barcode method
    addBarcode(
      data: string,
      type: string,
      hri?: 'none' | 'above' | 'below' | 'both',
      font?: 'font_a' | 'font_b' | 'font_c',
      width?: number,
      height?: number
    ): this;

    // Symbol method (QR codes, etc.)
    addSymbol(
      data: string,
      type: string,
      level?: string,
      width?: number,
      height?: number,
      size?: number
    ): this;

    // Command method
    addCommand(data: string): this;

    // Line methods
    addHLine(x1: number, x2: number, style?: 'thin' | 'medium' | 'thick' | 'thin_double' | 'medium_double' | 'thick_double'): this;
    addVLineBegin(x: number, style?: 'thin' | 'medium' | 'thick' | 'thin_double' | 'medium_double' | 'thick_double'): this;
    addVLineEnd(x: number, style?: 'thin' | 'medium' | 'thick' | 'thin_double' | 'medium_double' | 'thick_double'): this;

    // Page mode methods
    addPageBegin(): this;
    addPageEnd(): this;
    addPageArea(x: number, y: number, width: number, height: number): this;
    addPageDirection(dir: 'left_to_right' | 'bottom_to_top' | 'right_to_left' | 'top_to_bottom'): this;
    addPagePosition(x: number, y: number): this;
    addPageLine(x1: number, y1: number, x2: number, y2: number, style?: string): this;
    addPageRectangle(x1: number, y1: number, x2: number, y2: number, style?: string): this;

    // Rotate methods
    addRotateBegin(): this;
    addRotateEnd(): this;

    // Cut method
    addCut(type?: 'no_feed' | 'feed' | 'reserve' | 'no_feed_fullcut' | 'feed_fullcut' | 'reserve_fullcut'): this;

    // Drawer/Pulse method
    addPulse(drawer?: 'drawer_1' | 'drawer_2', time?: 'pulse_100' | 'pulse_200' | 'pulse_300' | 'pulse_400' | 'pulse_500'): this;

    // Sound method
    addSound(pattern?: string, repeat?: number, cycle?: number): this;

    // Layout method
    addLayout(
      type: 'receipt' | 'receipt_bm' | 'label' | 'label_bm',
      width?: number,
      height?: number,
      margin_top?: number,
      margin_bottom?: number,
      offset_cut?: number,
      offset_label?: number
    ): this;

    // Recovery/Reset methods
    addRecovery(): this;
    addReset(): this;

    // Convert to XML string
    toString(): string;
  }

  // ePOSPrint - Send print jobs
  class ePOSPrint extends ePOSBuilder {
    address: string;
    enabled: boolean;
    interval: number;
    timeout: number;
    status: number;
    battery: number;
    drawerOpenLevel: number;

    // Status constants
    ASB_NO_RESPONSE: 1;
    ASB_PRINT_SUCCESS: 2;
    ASB_DRAWER_KICK: 4;
    ASB_BATTERY_OFFLINE: 4;
    ASB_OFF_LINE: 8;
    ASB_COVER_OPEN: 32;
    ASB_PAPER_FEED: 64;
    ASB_WAIT_ON_LINE: 256;
    ASB_PANEL_SWITCH: 512;
    ASB_MECHANICAL_ERR: 1024;
    ASB_AUTOCUTTER_ERR: 2048;
    ASB_UNRECOVER_ERR: 8192;
    ASB_AUTORECOVER_ERR: 16384;
    ASB_RECEIPT_NEAR_END: 131072;
    ASB_RECEIPT_END: 524288;
    ASB_SPOOLER_IS_STOPPED: 2147483648;

    DRAWER_OPEN_LEVEL_LOW: 0;
    DRAWER_OPEN_LEVEL_HIGH: 1;

    // Callbacks
    onreceive: ((res: PrintResponse) => void) | null;
    onerror: ((err: PrintError) => void) | null;
    onstatuschange: ((status: number) => void) | null;
    ononline: (() => void) | null;
    onoffline: (() => void) | null;
    onpoweroff: (() => void) | null;
    oncoverok: (() => void) | null;
    oncoveropen: (() => void) | null;
    onpaperok: (() => void) | null;
    onpaperend: (() => void) | null;
    onpapernearend: (() => void) | null;
    ondrawerclosed: (() => void) | null;
    ondraweropen: (() => void) | null;
    onbatterylow: (() => void) | null;
    onbatteryok: (() => void) | null;
    onbatterystatuschange: ((battery: number) => void) | null;

    constructor(address: string);

    open(): void;
    close(): void;
    send(request?: string, printjobid?: string): void;
    getPrintJobStatus(printjobid: string): void;
  }

  // CanvasPrint - Print from canvas
  class CanvasPrint extends ePOSPrint {
    mode: 'mono' | 'gray16';
    halftone: number;
    brightness: number;
    align: 'left' | 'center' | 'right';
    color: 'none' | 'color_1' | 'color_2' | 'color_3' | 'color_4';
    paper: 'receipt' | 'receipt_bm' | 'label' | 'label_bm';
    feed: 'peeling' | 'cutting' | 'current_tof' | 'next_tof';
    cut: boolean;
    layout: LayoutConfig | null;

    PAPER_RECEIPT: 'receipt';
    PAPER_RECEIPT_BM: 'receipt_bm';
    PAPER_LABEL: 'label';
    PAPER_LABEL_BM: 'label_bm';

    constructor(address: string);

    print(canvas: HTMLCanvasElement, cut?: boolean, mode?: 'mono' | 'gray16', printjobid?: string): void;
    recover(): void;
    reset(): void;
  }

  interface PrintResponse {
    success: boolean;
    code: string;
    status: number;
    battery?: number;
    printjobid?: string;
  }

  interface PrintError {
    status: number;
    responseText: string;
  }

  interface LayoutConfig {
    width: number;
    height: number;
    margin_top: number;
    margin_bottom: number;
    offset_cut: number;
    offset_label: number;
  }

  // ePOSDevice - Connect to devices via WebSocket
  class ePOSDevice {
    // Connection state
    readonly DEVICE_TYPE_PRINTER: 'type_printer';
    readonly DEVICE_TYPE_DISPLAY: 'type_display';
    readonly DEVICE_TYPE_KEYBOARD: 'type_keyboard';
    readonly DEVICE_TYPE_SCANNER: 'type_scanner';
    readonly DEVICE_TYPE_SERIAL: 'type_serial';
    readonly DEVICE_TYPE_HYBRID_PRINTER: 'type_hybrid_printer';
    readonly DEVICE_TYPE_HYBRID_PRINTER2: 'type_hybrid_printer2';
    readonly DEVICE_TYPE_DT: 'type_dt';
    readonly DEVICE_TYPE_POS_KEYBOARD: 'type_pos_keyboard';
    readonly DEVICE_TYPE_MSR: 'type_msr';
    readonly DEVICE_TYPE_CAT: 'type_cat';
    readonly DEVICE_TYPE_CASH_CHANGER: 'type_cash_changer';
    readonly DEVICE_TYPE_IMAGE_SCANNER: 'type_image_scanner';
    readonly DEVICE_TYPE_OTHER_PERIPHERAL: 'type_other_peripheral';
    readonly DEVICE_TYPE_GFE: 'type_gfe';

    // Connect result codes
    readonly RESULT_OK: 'OK';
    readonly RESULT_SSL_CONNECT_OK: 'SSL_CONNECT_OK';

    // Error codes
    readonly ERROR_TIMEOUT: 'TIMEOUT';
    readonly ERROR_PARAMETER: 'PARAMETER_ERROR';
    readonly ERROR_SYSTEM: 'SYSTEM_ERROR';
    readonly ERROR_COMMUNICATION: 'COMMUNICATION_ERROR';
    readonly ERROR_DEVICE_NOT_FOUND: 'DEVICE_NOT_FOUND';
    readonly ERROR_DEVICE_IN_USE: 'DEVICE_IN_USE';

    // Callbacks
    onconnect: ((connectData: { result: string }) => void) | null;
    ondisconnect: (() => void) | null;

    constructor();

    /**
     * Connect to an ePOS device server
     * @param address IP address or hostname
     * @param port Port number (default: 8008 for WebSocket, 8043 for secure WebSocket)
     * @param callback Optional callback function
     * @param options Connection options
     */
    connect(
      address: string,
      port: number,
      callback?: (data: { result: string }) => void,
      options?: {
        eposprint?: boolean;
        useCrypto?: boolean;
      }
    ): void;

    /**
     * Disconnect from the device server
     */
    disconnect(): void;

    /**
     * Check if connected
     */
    isConnected(): boolean;

    /**
     * Create a device object
     * @param deviceId Device ID
     * @param deviceType Type of device
     * @param options Device options
     * @param callback Callback with device object or error
     */
    createDevice(
      deviceId: string,
      deviceType: 'type_printer' | 'type_display' | 'type_keyboard' | 'type_scanner' | 'type_serial' | 'type_hybrid_printer' | 'type_hybrid_printer2' | 'type_dt' | 'type_pos_keyboard' | 'type_msr' | 'type_cat' | 'type_cash_changer' | 'type_image_scanner' | 'type_other_peripheral' | 'type_gfe',
      options: {
        crypto?: boolean;
        buffer?: boolean;
      },
      callback: (deviceObj: DevicePrinter | null, errorCode: string) => void
    ): void;

    /**
     * Delete a device object
     * @param deviceObj Device object to delete
     * @param callback Callback with result
     */
    deleteDevice(
      deviceObj: DevicePrinter,
      callback: (errorCode: string) => void
    ): void;

    /**
     * Get admin object for device management
     */
    getAdmin(): DeviceAdmin;
  }

  // Device Printer object (returned by createDevice for printers)
  interface DevicePrinter extends ePOSBuilder {
    timeout: number;
    interval: number;

    // Callbacks
    onreceive: ((res: PrintResponse) => void) | null;
    onerror: ((err: PrintError) => void) | null;
    onstatuschange: ((status: number) => void) | null;
    oneventhttpresponse: ((res: HttpResponse) => void) | null;

    // Send print data
    send(): void;

    // Get printer status
    status: number;
  }

  // Device Admin object
  interface DeviceAdmin {
    getPrinterSetting(
      type: number,
      callback: (data: PrinterSettingResponse) => void
    ): void;
    setPrinterSetting(
      type: number,
      value: string | number | boolean,
      administratorPassword: string,
      callback: (data: PrinterSettingResponse) => void
    ): void;
    getPrinterSettingEx(
      callback: (data: PrinterSettingExResponse) => void
    ): void;
    setPrinterSettingEx(
      data: PrinterSettingExData,
      administratorPassword: string,
      callback: (data: PrinterSettingResponse) => void
    ): void;
  }

  // HTTP Response for event callbacks
  interface HttpResponse {
    status: number;
    responseText: string;
    headers?: Record<string, string>;
  }

  // Printer setting response
  interface PrinterSettingResponse {
    code: string;
    success: boolean;
  }

  // Printer setting extended response
  interface PrinterSettingExResponse {
    code: string;
    success: boolean;
    settings?: Record<string, string | number | boolean>;
  }

  // Printer setting extended data
  interface PrinterSettingExData {
    [key: string]: string | number | boolean;
  }
}

export { epson };
export default epson;
