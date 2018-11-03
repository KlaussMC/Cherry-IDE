module.exports = class {
    constructor(type, args, location) {
        this.type = type;
        this.args = args;
        this.location = location;

        this.tagName = this.getTagName(this.type)
    }

    toHTML() {
        return `<${this.tagName}${this.convertArgsToHTML(this.args)}${this.closingTag?'':' /'}>`;
    }

    closeTag() {
        return `${this.closingTag?'</'+this.tagName+'>':''}`
    }

    getTagName(value) {
        switch (value) {
            case 'bold':
                this.closingTag = true;
                return 'b'
            case 'italic':
                this.closingTag = true;
                return 'i'
            case 'code':
                this.closingTag = true;
                return 'code'
            case 'paragraph':
                this.closingTag = true;
                return 'p'
            case 'list':
                this.closingTag = true;
                return 'li';
            case 'divider':
                this.closingTag = false;
                return 'hr'
            case 'linebreak':
                this.closingTag = false;
                return 'br'
            default:
                return value;
        }
    }

    convertArgsToHTML(args) {
        args = args || {}
        let output = "";
        Object.keys(args).forEach(a => {
            output += ` ${a}="${args[a]}"`
        })
        return output;
    }
}