<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addDialogVisible = true"
            >添加角色</el-button
          >
        </el-col>
      </el-row>

      <!-- 添加角色的对话框 -->
      <el-dialog
        title="添加角色"
        :visible.sync="addDialogVisible"
        width="50%"
        @close="addDialogClose"
      >
        <!-- 主体区 -->
        <el-form
          :model="addRoleForm"
          :rules="addRoleFormRules"
          ref="addRoleFormRef"
          label-width="80px"
        >
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="addRoleForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="addRoleForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addRole">确 定</el-button>
        </span>
      </el-dialog>

      <el-table :data="rolelist" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom', index1 === 0 ? 'bdtop' : '', 'vcenter']"
              v-for="(item1, index1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag
                  closable
                  @close="removeRightByID(scope.row, item1.id)"
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <el-row
                  :class="[index2 !== 0 ? 'bdtop' : '', 'vcenter']"
                  v-for="(item2, index2) in item1.children"
                  :key="item2.id"
                >
                  <!-- 渲染二级权限 -->
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightByID(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 渲染三级权限 -->
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRightByID(scope.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" label="#"></el-table-column>
        <!-- 列(属性) lable是列(属性)名 prop是data中的属性名 -->
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 编辑 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditRoleDialog(scope.row.id)"
              >编辑</el-button
            >
            <!-- 删除 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeRoleByID(scope.row.id)"
              >删除</el-button
            >
            <!-- 分配权限 -->
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showSetRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 修改角色的对话框 -->
      <el-dialog
        title="修改角色"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="editDialogClose"
      >
        <!-- 主体区 -->
        <el-form
          :model="editRoleForm"
          :rules="editRoleFormRules"
          ref="editRoleFormRef"
          label-width="80px"
        >
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="editRoleForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="editRoleForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editRoleInfo()">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 分配权限的对话框 -->
      <el-dialog
        title="分配权限"
        :visible.sync="setRightDialogVisible"
        width="50%"
        @close="setRightDialogClosed"
      >
        <!-- 树形控件 -->
        <el-tree
          :data="rightsList"
          :props="treeProps"
          show-checkbox
          node-key="id"
          :default-expand-all="true"
          :default-checked-keys="defKeys"
          ref="treeRef"
        ></el-tree>

        <span slot="footer" class="dialog-footer">
          <el-button @click="setRightDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="allotRights">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rolelist: [],
      // 控制添加角色弹出框是否显示
      addDialogVisible: false,
      // 添加角色表单
      addRoleForm: {
        roleName: '',
        roleDesc: '',
      },
      // 添加表单的验证规则对象
      addRoleFormRules: {
        roleName: [
          { required: true, message: '请输入角色名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '角色名在3-10个字符之间',
            trigger: 'blur',
          },
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          {
            min: 0,
            max: 20,
            message: '角色描述在0-20个字符之间',
            trigger: 'blur',
          },
        ],
      },
      // 控制修改角色弹出框是否显示
      editDialogVisible: false,
      // 修改角色表单
      editRoleForm: {},
      // 修改表单的验证规则对象
      editRoleFormRules: {
        roleName: [
          { required: true, message: '请输入角色名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '角色名在3-10个字符之间',
            trigger: 'blur',
          },
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          {
            min: 0,
            max: 20,
            message: '角色描述在0-20个字符之间',
            trigger: 'blur',
          },
        ],
      },

      // 控制分配权限对话框的显示与隐藏
      setRightDialogVisible: false,
      // 所有权限
      rightsList: [],
      // 树形控件的属性绑定对象
      treeProps: {
        children: 'children',
        label: 'authName',
      },
      // 分配权限对话框展示时默认勾选的id数组
      defKeys: [],
      // 分配权限时的角色id
      roleId: '',
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    // 获取角色列表
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      } else {
        this.rolelist = res.data
      }
    },
    // 添加角色
    addRole() {
      this.$refs.addRoleFormRef.validate(async (valid) => {
        if (!valid) {
          return false
        } else {
          const { data: res } = await this.$http.post('roles', this.addRoleForm)
          console.log(res)
          if (res.meta.status !== 201) {
            this.$message.error('添加角色失败')
          } else {
            this.$message.success('添加角色成功')
            this.addDialogVisible = false
            this.getRolesList()
          }
        }
      })
    },
    // 关闭添加角色对话框
    addDialogClose() {
      this.$refs.addRoleFormRef.resetFields()
    },
    // 显示修改角色信息对话框
    async showEditRoleDialog(id) {
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('查询角色信息失败')
      } else {
        this.editRoleForm = res.data
        this.editDialogVisible = true
      }
    },
    // 修改角色信息并提交
    editRoleInfo() {
      console.log(this.editRoleForm)
      this.$refs.editRoleFormRef.validate(async (valid) => {
        if (!valid) {
          return false
        } else {
          const { data: res } = await this.$http.put(
            'roles/' + this.editRoleForm.roleId,
            {
              id: this.editRoleForm.roleId,
              roleName: this.editRoleForm.roleName,
              roleDesc: this.editRoleForm.roleDesc,
            }
          )
          console.log(res)
          if (res.meta.status !== 200) {
            return this.$message.error('修改角色信息失败')
          } else {
            this.editDialogVisible = false
            this.$message.success('修改角色信息成功')
            this.getRolesList()
          }
        }
      })
    },
    // 关闭修改角色对话框
    editDialogClose() {
      this.$refs.editRoleFormRef.resetFields()
    },
    // 删除角色
    removeRoleByID(id) {
      this.$confirm('是否确定要删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'waring',
      })
        .then(async () => {
          const { data: res } = await this.$http.delete('roles/' + id)
          if (res.meta.status !== 200) {
            this.$message.error('删除失败')
          } else {
            this.$message.success('删除成功')
            this.getRolesList()
          }
        })
        .catch(() => {
          this.$message.info('已取消删除')
        })
    },
    // 根据id删除权限
    removeRightByID(role, rightId) {
      this.$confirm('是否确定要删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'waring',
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(
            `roles/${role.id}/rights/${rightId}`
          )
          if (res.meta.status !== 200) {
            this.$message.error('删除失败')
          } else {
            this.$message.success('删除成功')
            // this.getRolesList()
            role.children = res.data
          }
        })
        .catch(() => {
          this.$message.info('已取消删除')
        })
    },
    // 展示分配权限的对话框
    async showSetRightDialog(role) {
      // 获取所有权限
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        this.$message.error('获取权限信息失败')
      } else {
        // 获取到的权限数据保存在rightList
        this.rightsList = res.data
        // console.log(this.rightsList)
        this.getLeafKeys(role, this.defKeys)
        this.roleId = role.id
        this.setRightDialogVisible = true
      }
    },
    // 通过递归将角色的三级权限id保存到defKeys数组中
    getLeafKeys(node, arr) {
      if (!node.children) {
        // 该节点没有子节点，即三级节点
        return arr.push(node.id)
      } else {
        node.children.forEach((item) => {
          this.getLeafKeys(item, arr)
        })
      }
    },
    // 监听分配权限对话框关闭事件
    setRightDialogClosed() {
      this.defKeys = []
    },
    // 为角色分配权限
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ]
      // console.log(keys)
      const idStr = keys.join(',')
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        {
          rids: idStr,
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('分配角色权限失败')
      } else {
        this.$message.success('分配角色权限成功')
        this.setRightDialogVisible = false
        this.getRolesList()
      }
    },
  },
}
</script>

<style lang='less' scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
