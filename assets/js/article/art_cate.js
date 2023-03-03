$(function() {
    var layer = layui.layer
    var form = layui.form


    initArtCateList()

    // 获取文章分类的列表
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }

    // 为添加类别按钮绑定点击事件
    var indexAdd = null
    $('#btnAddCate').on('click', function() {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        })
    })

    // 通过代理的形式，为 form-add 表单绑定 submit 事件
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                console.log(res)
                if (res.status !== 0) {
                    return layer.msg('新增分类失败！')
                }
                initArtCateList()
                layer.msg('新增分类成功！')
                    // 根据索引，关闭对应的弹出层
                layer.close(indexAdd)
            }
        })
    })


    // 通过代理的形式，为 btn-edit按钮绑定 click 事件
    $('tbody').on('click', '.btn-edit', function(e) {
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        })

        // 在展示弹出层之后，根据 id 的值发起请求获取文章分类的数据，并填充到表单中
        var id = $(this).attr('data-id')
            // console.log(id)
            // 发起请求获取对应分类的数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                // console.log(res)
                form.val("form-edit", res.data)
            }
        })


    })

    // 1.3 更新文章分类的数据
    // 通过代理的形式，为修改分类的表单绑定 submit 事件：
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                console.log(res)
                if (res.status !== 0) {
                    return layer.msg('更新分类失败！')
                }
                initArtCateList()
                layer.msg('更新分类成功！')
                    // 根据索引，关闭对应的弹出层
                layer.close(indexEdit)
            }
        })

    })

    // 1.4 删除文章分类
    $('tbody').on('click', '.btn-delete', function(e) {
        var id = $(this).attr('data-id')
            // 提示用户是否要删除
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    console.log(res)
                    if (res.status !== 0) {
                        return layer.msg('删除失败！')
                    }
                    initArtCateList()
                    layer.msg('删除成功！')
                }
            })

            layer.close(index);
        });

    })




})