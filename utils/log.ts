import dayjs from "dayjs";

enum LogType {
  info = 'Info',
  error = 'Error',
  warning = 'Warning',
  success = 'Success'
}

/**
 * 美化打印方法
 */
class LogClass {
  constructor() {
    console.clear()
    console.log(
      '✨ %c init prettyLog ',
      'background:#00DC82; padding: 2px; border-radius: 2px; color: #fff'
    );
  }

  isEmpty = (value: any) => {
    return value == null || value === undefined || value === '';
  };

  prettyPrint = (type: LogType, title: string, text: string, color: string) => {

    if (process.server) {
      return
    }

    const stack = new Error().stack!.split('\n')[3].trim();
    console.group(`%c[ ${type} ] ${dayjs().format('YYYY-MM-DD HH:mm:ss')} %c ${title} `,
      `background:${color};border:1px solid ${color};padding:1px 4px;color: #fff;margin: 4px 0`,
      `border:1px solid ${color}; padding: 1px; border-radius: 0 2px 2px 0; color: ${color};`,
    )
    console.log(
      `%c${text}%c\n%cfile: ${stack.replace('at ', '')}`,
      `background:${color};border:1px solid ${color};padding:1px 4px;color: #fff;margin: 4px 0`,
      `border:none;`,
      `border:1px solid ${color}; padding: 2px;`,
    );
    console.groupEnd();
  };

  info = (textOrTitle: string, content = '') => {
    const title = this.isEmpty(content) ? 'info' : textOrTitle;
    const text = this.isEmpty(content) ? textOrTitle : content;
    this.prettyPrint(LogType.info, title, text, '#909399');
  };

  error = (textOrTitle: string, content = '') => {
    const title = this.isEmpty(content) ? 'error' : textOrTitle;
    const text = this.isEmpty(content) ? textOrTitle : content;
    this.prettyPrint(LogType.error, title, text, '#F56C6C');
  };

  warning = (textOrTitle: string, content = '') => {
    const title = this.isEmpty(content) ? 'warning' : textOrTitle;
    const text = this.isEmpty(content) ? textOrTitle : content;
    this.prettyPrint(LogType.warning, title, text, '#E6A23C');
  };

  success = (textOrTitle: string, content = '') => {
    const title = this.isEmpty(content) ? 'success' : textOrTitle;
    const text = this.isEmpty(content) ? textOrTitle : content;
    this.prettyPrint(LogType.success, title, text, '#67C23A');
  };
}


const Log = new LogClass();

export default Log;