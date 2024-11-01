import uniqueId from '@form-create/utils/lib/unique';
import {localeOptions, localeProps} from '../../utils';

const label = '上传';
const name = 'upload';

export default {
    menu: 'main',
    icon: 'icon-upload',
    label,
    name,
    event: ['change', 'remove'],
    validate: ['array'],
    rule({t}) {
        return {
            type: name,
            field: uniqueId(),
            title: t('com.upload.name'),
            info: '',
            $required: false,
            props: {
                action: '/',
                listType: 'text',
                limit: 5,
            }
        };
    },
    props(_, {t}) {
        return localeProps(t, name + '.props', [
            { type: 'switch', field: 'disabled' },
            { type: 'switch', field: 'multiple' },
            { type: 'input', field: 'accept' },
            { type: 'inputNumber', field: 'limit', props: { min: 0 } },
        ]);
    }
};
