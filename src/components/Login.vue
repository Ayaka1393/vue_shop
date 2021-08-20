<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="" />
      </div>
      <!-- 登录表单区域 -->
      <!-- 使用element-ui中的组件，必须要先在../plugins/element.js中按需导入组件 -->
      <el-form
        label-width="0"
        class="login_form"
        :model="loginForm"
        :rules="loginFormRules"
        ref="loginFormRef"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            prefix-icon="iconfont icon-user"
            v-model="loginForm.username"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            prefix-icon="iconfont icon-password"
            v-model="loginForm.password"
            show-password
          ></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 登录表单的数据绑定对象
      loginForm: {
        username: 'admin',
        password: '123456',
      },
      // 表单的验证规则对象
      loginFormRules: {
        // 验证用户名是否合法
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在3到10个字符', trigger: 'blur' },
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在6到15个字符', trigger: 'blur' },
        ],
      },
    }
  },
  methods: {
    resetLoginForm() {
      // 这里的this就是Login.vue这个
      // console.log(this);
      this.$refs.loginFormRef.resetFields()
    },
    login() {
      // validate()对整个表单进行校验的方法
      // validate()的参数是一个回调函数，该回调函数会在校验结束后被调用，并传入两个参数：是否校验成功(boolean)和未通过校验的字段(object)
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) {
          return false
        } else {
          const { data: res } = await this.$http.post('login', this.loginForm)
          if (res.meta.status !== 200) {
            this.$message.error('登录失败')
            return false
          } else {
            this.$message.success('登录成功')
            // 将登录成功之后的token，保存到客户端的sessionStorage中
            window.sessionStorage.setItem('token', res.data.token)
            // 通过编程式导航跳转到后台主页
            this.$router.push('/home')
          }
        }
      })
    },
  },
}
</script>

<style lang='less' scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}

.login_box {
  position: absolute;
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  .avatar_box {
    position: absolute;
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    left: 50%;
    transform: translate(-50%, -40%);
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: #eee;
    }
  }

  .login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;

    .btns {
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>
