export class MainUtil {


    /**
     * 生成指定程度的随机字符串
     * 小写字母开头,其他位置包含数字和小写字母
     *
     * @param length 指定长度,默认值8
     */
    public static randomId(length: number|null): string {
        const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
        const firstCharacter = 'abcdefghijklmnopqrstuvwxyz';

        let id = firstCharacter[Math.floor(Math.random() * firstCharacter.length)];
        if (!length){
            length = 8
        }
        for (let i = 1; i < length; i++) {
            id += characters[Math.floor(Math.random() * characters.length)];
        }
        return id;
    }

    /**
     * 获取html元素
     * @param name 元素名
     * @param clazz 元素包含的类
     */
    public static getElement(name: string, ...clazz: string[]): HTMLElement {
        const ele = document.createElement(name)
        if (clazz){
            ele.classList.add(...clazz)
        }
        return ele;
    }
}

