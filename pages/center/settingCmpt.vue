<script setup lang="ts">
import { MessagePlugin } from 'tdesign-vue-next';
import { GetBindInfo, Logout, PostUnbindEmail, PostbindEmail, PutLogin, ResetPass, SendFogetCode } from './fetch';
import { UseUserInfoStore } from 'stores'

let codeTimer: any = 0

const userInfoStore = UseUserInfoStore()
const router = useRouter()

const currentItem = ref('1')
const xiugaiMima = reactive({
  oldPass: "",
  newPass: "",
  rePass: ""
})
const hadPass = ref(true)
const wangjiMima = reactive({
  newPass: "",
  rePass: "",
  code: ""
})
const codeTime = ref(0)
const wechatBind = ref<null | boolean>(null)
const sendUnbindReq = ref({
  url: "user/operate/email/1",
  method: "post"
})
const sendbindReq = ref({
  url: "user/operate/email/2",
  method: "post",
  data: {
    email: ""
  }
})
const emailBind = ref('')
const bindEmailV = ref('')
const unbindCode = ref('')
const sendbindWeReq = ref({
  url: 'wechat/operate/wecode/1'
})
const sendUnbindWeReq = {
  url: 'wechat/operate/wecode/2'
}


const xiugaiMimaSubmit = async () => {
  const { oldPass, newPass, rePass } = xiugaiMima;
  if (!oldPass && hadPass.value) {
    MessagePlugin.info("请输入当前密码");
    return;
  }
  if (!newPass) {
    MessagePlugin.info("请输入修改密码");
    return;
  }
  if (!rePass) {
    MessagePlugin.info("请输入确认密码");
    return;
  }
  if (newPass !== rePass) {
    MessagePlugin.info("两次密码输入不一致");
    return;
  }
  const res = await PutLogin({
    oldPass,
    newPass
  });
  if (res && res.code === 0) {
    MessagePlugin.success("修改密码成功");
    xiugaiMima.oldPass = "";
    xiugaiMima.newPass = "";
    xiugaiMima.rePass = "";
    hadPass.value = true
  }
  else {
    MessagePlugin.error(res?.msg || "修改密码失败");
  }
}
const sentCode = async () => {
  const res = await SendFogetCode();
  if (res && res.code === 0) {
    MessagePlugin.success("验证码发送成功");
    codeTime.value = 60;
    codeTimer = setInterval(() => {
      codeTime.value--;
      if (codeTime.value <= 0) {
        clearInterval(codeTimer);
        codeTime.value = 0;
      }
    }, 1000);
  }
  else {
    MessagePlugin.error(res?.msg || "验证码发送失败");
  }
}
const wangjiMimaSubmit = async () => {
  const { newPass: pass, rePass, code } = wangjiMima;
  if (!pass) {
    MessagePlugin.info("请输入修改密码");
    return;
  }
  if (!rePass) {
    MessagePlugin.info("请输入确认密码");
    return;
  }
  if (!code) {
    MessagePlugin.info("请输入验证码");
    return;
  }
  if (pass !== rePass) {
    MessagePlugin.info("两次密码输入不一致");
    return;
  }
  const res = await ResetPass({
    pass,
    code
  });
  if (res && res.code === 0) {
    MessagePlugin.success("修改密码成功");
    wangjiMima.newPass = ''
    wangjiMima.rePass = ''
    wangjiMima.code = ''
    clearInterval(codeTimer);
    codeTime.value = 0;
  }
  else {
    MessagePlugin.error(res?.msg || "修改密码失败");
  }
}
const unbindEmailClick = async () => {
  if (!unbindCode.value) {
    MessagePlugin.info("请输入验证码");
    return;
  }
  const res = await PostUnbindEmail(unbindCode.value);
  if (res && res.code === 0) {
    MessagePlugin.success("解绑邮箱成功");
    emailBind.value = "";
    unbindCode.value = "";
  }
  else {
    MessagePlugin.error(`解绑邮箱失败 ${res?.msg || ""}`);
  }
}
const bindEmailClick = async () => {
  if (!unbindCode.value) {
    MessagePlugin.info("请输入验证码");
    return;
  }
  if (!sendbindReq.value.data.email) {
    MessagePlugin.info("请输入邮箱");
    return;
  }
  const res = await PostbindEmail({
    code: unbindCode.value,
    email: sendbindReq.value.data.email
  });
  if (res && res.code === 0) {
    MessagePlugin.success("绑定邮箱成功");
    let len = sendbindReq.value.data.email.length;
    emailBind.value = (sendbindReq.value.data.email as string).substring(0, 3) + "*****" + (sendbindReq.value.data.email as string).substring(len - 3, len);
    unbindCode.value = "";
    sendbindReq.value.data.email = "";
  }
  else {
    MessagePlugin.error(`绑定邮箱失败 ${res?.msg || ""}`);
  }
}

const bindWechatComplete = () => {
  wechatBind.value = true
}

const unindWechatComplete = () => {
  wechatBind.value = false
}

const logoutBtn = () => {
  Logout();
  SetAuthorization("");
  userInfoStore.setUserInfo({ userName: "", avatar: "", userId: 0 })
  router.replace("/login");
}

onMounted(async () => {
  const res = await GetBindInfo();
  if (res && res.code === 0) {
    wechatBind.value = res.data.wechat;
    emailBind.value = res.data.email;
    hadPass.value = res.data.pass
    return;
  }
  MessagePlugin.error("查询用户绑定信息失败" + res?.msg);
})
</script>

<template>
  <div class="center-setting">
    <t-collapse expandMutex>
      <t-collapse-panel header="修改密码">
        <t-form :data="xiugaiMima" colon class="center-setting-xiugaiMima" @submit="xiugaiMimaSubmit">
          <t-form-item v-show="hadPass" name="oldPass" label="当前密码">
            <t-input clearable type="password" v-model="xiugaiMima.oldPass" placeholder="请输入当前密码"></t-input>
          </t-form-item>
          <t-form-item name="newPass" label="修改密码">
            <t-input type="password" clearable v-model="xiugaiMima.newPass" placeholder="请输入修改密码"></t-input>
          </t-form-item>
          <t-form-item name="rePass" label="确认密码">
            <t-input type="password" clearable v-model="xiugaiMima.rePass" placeholder="请输入确认密码"></t-input>
          </t-form-item>
          <t-form-item>
            <t-button theme="primary" type="submit" block>修改</t-button>
          </t-form-item>
        </t-form>
      </t-collapse-panel>
      <t-collapse-panel header="忘记密码">
        <t-form :data="wangjiMima" colon class="center-setting-wangjiMima" @submit="wangjiMimaSubmit">
          <t-form-item name="newPass" label="修改密码">
            <t-input type="password" clearable v-model="wangjiMima.newPass" placeholder="请输入修改密码"></t-input>
          </t-form-item>
          <t-form-item name="rePass" label="确认密码">
            <t-input type="password" clearable v-model="wangjiMima.rePass" placeholder="请输入确认密码"></t-input>
          </t-form-item>
          <t-form-item name="code" label="验证码">
            <t-input clearable v-model="wangjiMima.code" placeholder="请输入验证码"></t-input>
          </t-form-item>
          <t-form-item>
            <t-button theme="success" class="center-setting-wangjiMima-sendCode" @click="sentCode"
              :disabled="codeTime !== 0">发送验证码{{ codeTime !== 0 ? ` (${codeTime})` : '' }}
            </t-button>
            <t-button theme="primary" type="submit">修改</t-button>
          </t-form-item>
        </t-form>
      </t-collapse-panel>
      <t-collapse-panel header="绑定设置">
        <div v-show="wechatBind === true" class="setting-bind">
          <span class="bind-text">微信</span><span class="bind-text">已绑定</span>
          <ShowSCode :req="sendUnbindWeReq" title="解绑" susText="解除绑定成功" theme="danger" :complete="unindWechatComplete" />
        </div>
        <div v-show="wechatBind === false" class="setting-bind">
          <span class="bind-text">微信</span><span class="bind-text">未绑定</span>
          <ShowSCode :req="sendbindWeReq" title="绑定" susText="微信绑定成功" theme="primary" :complete="bindWechatComplete" />
        </div>
        <div v-show="emailBind !== ''" class="setting-bind">
          <span class="bind-text">邮箱</span><span class="bind-text">{{ emailBind }}</span>
          <t-input type="tel" v-model="unbindCode" class="bind-code" clearable placeholder="请输入验证码" />
          <SendCode :req="sendUnbindReq" className="bind-sendcode" />
          <t-button theme="danger" @click="unbindEmailClick">解绑</t-button>
        </div>
        <div v-show="emailBind === ''" class="setting-bind">
          <span class="bind-text">邮箱</span>
          <t-input type="text" v-model="sendbindReq.data.email" class="bind-email" clearable placeholder="请输入邮箱" />
          <t-input type="tel" v-model="unbindCode" class="bind-code" clearable placeholder="请输入验证码" />
          <SendCode :req="sendbindReq" className="bind-sendcode" />
          <t-button theme="primary" @click="bindEmailClick">绑定</t-button>
        </div>
      </t-collapse-panel>
    </t-collapse>
    <t-button class="center-setting-logout" theme="danger" @click="logoutBtn">退出登录</t-button>
  </div>
</template>

<style lang="less">
.center-setting {
  padding: 10px;

  .el-collapse-item__content {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .center-setting-xiugaiMima,
  .center-setting-wangjiMima {
    width: 500px;
  }

  .center-setting-wangjiMima {
    &-sendCode {
      margin-right: 20px;
      margin-left: 100px;
    }
  }

  .center-setting-logout {
    margin-top: 10px;
    margin-bottom: 10px;
  }

  .setting-bind {
    width: 100%;
    padding-left: 50px;
    display: flex;
    align-items: center;
    margin: 10px 0;

    .bind-text {
      margin-right: 10px;

      &:nth-child(2) {
        display: block;
        width: 100px;
        color: var(--td-brand-color);
      }
    }

    .bind-code {
      width: 150px;
      margin-right: 8px;
    }

    .bind-email {
      width: 200px;
      margin-right: 8px;
    }

    .bind-sendcode {
      margin-right: 8px;
    }
  }
}
</style>