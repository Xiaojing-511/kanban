import Vue from 'vue'


import {
    Steps,
    Tooltip,
    Modal,
    List,
    Anchor,
    Avatar,
    Button,
    Result,
    Message,
    InputNumber,
    Input,
    Icon,
    Radio,
    Drawer,
    Empty,
    DatePicker,
    Dropdown,
    Menu,
    Badge,
    Select,
    Upload,
    Form,
    TreeSelect,
} from 'ant-design-vue';
const { Step } = Steps;
const { Item } = Form;
const { Link } = Anchor;
const { Option, OptGroup } = Select;
const { Group } = Radio;
const { TextArea } = Input;
Vue.use(Steps);
Vue.use(Step);
Vue.use(Tooltip);
Vue.use(Modal);
Vue.use(List);
Vue.use(Item);
Vue.use(Anchor);
Vue.use(Link);
Vue.use(Avatar);
Vue.use(Button);
Vue.use(InputNumber);
Vue.use(Select);
Vue.use(Option);
Vue.use(Input);
Vue.use(Result);
Vue.use(Radio);
Vue.use(Group);
Vue.use(Drawer);
Vue.use(Empty);
Vue.use(DatePicker);
Vue.use(Upload);
Vue.use(Dropdown);
Vue.use(Menu);
Vue.use(Icon);
Vue.use(Badge);
Vue.use(Message);
Vue.use(Form);
Vue.use(TreeSelect);
Vue.use(TextArea);

Vue.prototype.$confirm = Modal.confirm;
Vue.prototype.$message = Message;
Vue.prototype.$SHOW_PARENT = TreeSelect.SHOW_CHILD;