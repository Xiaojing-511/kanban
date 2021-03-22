import Vue from "vue";
import "element-ui/lib/theme-chalk/index.css";
import {
  Button,
  Scrollbar,
  Dialog,
  Popover,
  Tooltip,
  Carousel,
  CarouselItem,
  Image,
  Loading,
  MessageBox,
  Message,
  Rate,
  Avatar,
  Progress,
  Form,
  FormItem,
  Input,
  Select,
  Option,
  OptionGroup,
  Col,
  Radio,
  RadioGroup,
  DatePicker,
  Badge,
  Upload,
  Drawer,
  Collapse,
  CollapseItem,
  Steps,
  Step,
} from "element-ui";
Vue.use(Button);
Vue.use(Scrollbar);
Vue.use(Dialog);
Vue.use(Popover);
Vue.use(Tooltip);
Vue.use(Carousel);
Vue.use(CarouselItem);
Vue.use(Image);
Vue.use(Rate);
Vue.use(Avatar);
Vue.use(Progress);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Select);
Vue.use(Option);
Vue.use(OptionGroup);
Vue.use(Col);
Vue.use(Radio);
Vue.use(RadioGroup);
Vue.use(DatePicker);
Vue.use(Badge);
Vue.use(Upload);
Vue.use(Drawer);
Vue.use(Collapse);
Vue.use(CollapseItem);
Vue.use(Steps);
Vue.use(Step);
Vue.use(Loading.directive);
Vue.prototype.$loading = Loading.service;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
// Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
