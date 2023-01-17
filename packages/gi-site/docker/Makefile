MKFILE_PATH             := $(abspath $(lastword $(MAKEFILE_LIST)))
WORKING_DIR             := $(dir $(MKFILE_PATH))

ifeq ($(REGISTRY),)
    REGISTRY := registry.cn-hongkong.aliyuncs.com
endif

VERSION ?= latest

BUILD_PROGRESS = auto

.PHONY: website
website:
	cd $(WORKING_DIR) && \
	docker build \
		--progress=${BUILD_PROGRESS} \
		-t ${REGISTRY}/graphinsight/website:${VERSION} \
		-f ${WORKING_DIR}/website.Dockerfile .
