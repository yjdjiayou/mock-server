module.exports = {
    // url: '/comment-indexes/page',
    url: `/comment-indexes/:id/comment-papers`,
    template: {
        'list|1-10': [
            {
                'id|+1': 1,
            },
        ],
        name: '@cname', //中文人名
        id: '@id', //身份证 ID
        city: '@city', //中文城市
        email: '@email', //邮箱
    },
};
