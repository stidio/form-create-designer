import {localeProps, makeTitleRule} from '../../utils';

const label = 'HTML';
const name = 'html';

export default {
    menu: 'aide',
    icon: 'icon-html',
    label,
    name,
    rule() {
        return {
            type: name,
            title: '',
            native: true,
            attrs: {
                innerHTML: ''
            },
            style: {
                display: 'block',
                width: '100%',
            },
            children: ['<div style="color:blue;">\n' +
            ' html html html html html html html html html\n' +
            '  </div>'],
        };
    },
    watch: {
        formCreateNative({value, rule}) {
            if (value) {
                rule.title = '';
            }
        }
    },
    props(_, {t}) {
        return localeProps(t, name + '.props', [
            ...makeTitleRule(t),
            {
                type: 'HtmlEditor',
                field: 'formCreateChild',
            }
        ]);
    }
};
