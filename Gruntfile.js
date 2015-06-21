module.exports = function(grunt) {

    'use strict';

    // 자동으로 grunt 태스크를 로드합니다. grunt.loadNpmTasks 를 생략한다.
    require('load-grunt-tasks')(grunt);

    // 작업시간 표시
    require('time-grunt')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*!\n' +
        ' ======================================================================== \n' +
        ' * Project   : <%= pkg.name %>(<%= pkg.description %>) v<%= pkg.version %>\n' +
        ' * Publisher : <%= pkg.make.publisher %> (<%= pkg.make.email %>), (<%= pkg.make.blog %>)\n' +
        ' * Build     : <%= grunt.template.today("yyyy-mm-dd") %>\n' +
        ' * License   : <%= pkg.license.type %> (<%= pkg.license.url %>)\n' +
        ' ======================================================================== \n' +
        ' */\n',

        clean: {
            dev: {
                files: [{
                    dot: true,
                    src: [
                        'dev/**/*',
                        'app/css',
                        'dist/**/*'
                    ]
                }]
            },
            dist: {
                files: [{
                    dot: true,
                    src: [
                        'app/css',
                        'dist/**/*'
                    ]
                }]
            },
        },
       
// html task
        includes: {
            build: {
                cwd: 'app/docs/html/',
                src: ['**/*.html'],
                dest: 'dist',
                options: {
                    flatten: true,
                    // debug: true,
                    includePath: 'app/docs/include/'
                }
            }
        },
        htmlhint: {
            options: {
                htmlhintrc: 'gruntConfig/.htmlhintrc'
            },
            dist: [
                'app/docs/html/**/*.html',
                'app/docs/inclode/**/*.html'
            ]
        },

// css task
        less: {
            dist: {
                options: {
                    banner: '<%= banner %>',
                    dumpLineNumbers : 'comments'
                },
                src: 'app/less/style.less',
                dest: 'app/css/style.css'
            },
        },

        csslint: {
            options: {
                csslintrc: 'gruntConfig/.csslintrc'
            },
            dist: {
                src: '<%= less.dist.dest %>'
            }
        },

        autoprefixer: {
             options: {
                browsers: [
                    'Android 2.3',
                    'Android >= 4',
                    'Chrome >= 20',
                    'Firefox >= 24', // Firefox 24 is the latest ESR
                    'Explorer >= 8',
                    'iOS >= 6',
                    'Opera >= 12',
                    'Safari >= 6'
                ]
            },
            dist: { // app -> dest 이동
                expand: true,
                cwd: 'app/css/',
                src: ['*.css',],
                dest: 'dist/css/'
            }
        },
        
        csscomb: {
            options: {
                config: 'gruntConfig/.csscomb.json'
            },
            files: {
                'dist/css/style.css': ['app/css/style.css'],
            }
        },

        cssmin: {
            options: {
                // compatibility: 'ie8',
                keepSpecialComments: 1,
                // default - '!'가 붙은 주석은 보존,
                // 1 - '!'가 붙은 주석 중 첫번째 주석만 보존
                // 0 - 모든 주석 제거
                // noAdvanced: true,
            },
            dist: {
                src: 'dist/css/style.css',
                dest: 'dist/css/style.min.css'
            }
        },
        
// javascript task
        jshint: {
            options: {
                jshintrc: 'gruntConfig/.jshintrc',
                force: true, // error 검출시 task를 fail 시키지 않고 계속 진단
                reporter: require('jshint-stylish') // output을 수정 할 수 있는 옵션
            },
            grunt: {
                src: ['Gruntfile.js']
            },
            dist: {
                expand: true,
                cwd: 'app/js/site',
                src: ['*.js'],
                dest: 'app/js/site'
            }
        },

        concat: {
            dist: {
                options: {
                    banner: '<%= banner %>'
                },
                src: 'app/js/site/*.js',
                dest: 'dist/js/site/site.js'
            }
        },

        uglify: {
            options: {
                banner: '<%= banner %>'
            },
            dist: {
                src: '<%= concat.dist.dest %>',
                dest: 'dist/js/site.min.js'
            }
        },


// others task
        imagemin: {
            options: {
                title: 'Build complete',  // optional
                message: '<%= pkg.name %> build finished successfully.' //required
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: 'app/images/',
                    src: '**/*.{png,jpeg,jpg,gif}',
                    dest: 'dist/images/'
                }]
            }
        },

        copy: {
            basic: {
                files: [ 
                    // fonts
                    {
                        expand: true,
                        cwd: 'app/fonts/',
                        src: '**',
                        dest: 'dist/fonts/'
                    },
                    // js
                    {
                        expand: true,
                        cwd: 'app/js/lib',
                        src: ['*.js'],
                        dest: 'dist/js/lib'
                    }
                ]
            },
            dev: { // 개발폴더를 위한 복사
                files: [
                    { // html folder
                        expand: true,
                        cwd: 'app/docs/html/',
                        src: '**',
                        dest: 'dev/'
                    },
                    { // include folder
                        expand: true,
                        cwd: 'app/docs/',
                        src: ['include/**/*'],
                        dest: 'dev/'
                    },
                    { // css
                        expand: true,
                        cwd: 'dist/css/',
                        src: '**',
                        dest: 'dev/css/'
                    },
                    { // js
                        expand: true,
                        cwd: 'dist/js/',
                        src: '**',
                        dest: 'dev/js/'
                    },
                    { // images
                        expand: true,
                        cwd: 'dist/images/',
                        src: '**',
                        dest: 'dev/images/'
                    },
                    { // fonts
                        expand: true,
                        cwd: 'dist/fonts/',
                        src: '**',
                        dest: 'dev/fonts/'
                    }
                ],
            }
        },

        // watch task
        watch: {
            options: {livereload: true},
            gruntfile: {
                files: ['Gruntfile.js'],
                tasks: ['newer:jshint:grunt']
            },
            js: {
                files: ['app/js/**/*.js'],
                tasks: ['newer:jshint:dist','concat','uglify']
            },
            less: {
                files: ['app/less/**/*.less'],
                tasks: ['less','csslint','autoprefixer','csscomb','concat']
            },
            img: {
                files: ['app/images/**/*.{gif,jpeg,jpg,png}'],
                tasks: ['newer:imagemin']
            },
            html: {
                files: ['app/docs/**/*.html'],
                tasks: ['htmlhint','includes']
            }
        },
        connect: {
            server: {
                options: {
                    port: 9000,
                    hostname: 'localhost',
                    livereload: 35729,
                    // keepalive: true,
                    base: 'dist',
                    open: 'http://<%= connect.server.options.hostname %>:<%= connect.server.options.port %>/category1/page-01.html'
                }
            }
        },

        concurrent: {
            options: {
                logConcurrentOutput: true
            },
            dist: [
                'html',
                'css',
                'js',
                'newer:imagemin'
            ]
        },

        
    });

    
    // server
    grunt.registerTask('serve', function (target) {
        if (target === 'dist') {
            return grunt.task.run(['connect', 'watch']);
        }

        grunt.task.run([
            'default', 
            'connect', 
            'watch'
        ]);
    });

    // html task
    grunt.registerTask('html', [
            'htmlhint',
            'includes'
        ]
    );
    // css task
    grunt.registerTask('css', [
            'less',
            'csslint',
            'autoprefixer',
            'csscomb',
            'cssmin'
        ]
    );

    // javascript task
    grunt.registerTask('js', [
            'newer:jshint',
            'concat',
            'uglify'
        ]
    );
    

    grunt.registerTask('build', [
            'clean:dev',
            'concurrent',
            'copy'
        ]
    );

    grunt.registerTask('default', [
            'clean:dist',
            'concurrent',
            'copy:basic'
        ]
    );

};
