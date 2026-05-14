import Cropper from 'cropperjs';

/**
 * 图片处理器 - 基于 Cropper.js v2
 * 提供 1:1 和 3:4 比例的裁剪功能
 */

class ImageProcessor {

    constructor() {
        this.cropper = null;
        this.outputOptions = {};
    }

    /**
     * 设置裁剪输出尺寸
     * @param {number} width - 目标宽度
     * @param {number} height - 目标高度
     */
    setCropBoxData(width, height) {
        this.outputOptions = { width, height };
    }

    /**
     * 构建裁剪器 HTML 模板
     * @param {Object} options - 配置项
     * @returns {string} HTML 模板字符串
     */
    _buildTemplate(options = {}) {
        const {
            aspectRatio = NaN,
            initialCoverage = 0.8
        } = options;

        const aspectRatioAttr = Number.isFinite(aspectRatio) && aspectRatio > 0
            ? `aspect-ratio="${aspectRatio}"`
            : '';
        const initialCoverageAttr = `initial-coverage="${initialCoverage}"`;

        return (
            // ===== 关键修改 1：cropper-canvas 添加 style="width:100%;height:100%;display:block;" =====
            '<cropper-canvas background style="width:100%;height:100%;display:block;">'
            // ===== 关键修改 2：cropper-image 添加 style="width:100%;height:100%;object-fit:contain;" =====
            + '<cropper-image style="width:100%;height:100%;object-fit:contain;" rotatable scalable skewable translatable></cropper-image>'
            + '<cropper-shade hidden></cropper-shade>'
            + '<cropper-handle action="select" plain></cropper-handle>'
            + `<cropper-selection ${initialCoverageAttr} ${aspectRatioAttr} movable resizable zoomable keyboard>`
            + '<cropper-grid role="grid" bordered covered></cropper-grid>'
            + '<cropper-crosshair centered></cropper-crosshair>'
            + '<cropper-handle action="move" theme-color="rgba(255, 255, 255, 0.35)"></cropper-handle>'
            + '<cropper-handle action="n-resize"></cropper-handle>'
            + '<cropper-handle action="e-resize"></cropper-handle>'
            + '<cropper-handle action="s-resize"></cropper-handle>'
            + '<cropper-handle action="w-resize"></cropper-handle>'
            + '<cropper-handle action="ne-resize"></cropper-handle>'
            + '<cropper-handle action="nw-resize"></cropper-handle>'
            + '<cropper-handle action="se-resize"></cropper-handle>'
            + '<cropper-handle action="sw-resize"></cropper-handle>'
            + '</cropper-selection>'
            + '</cropper-canvas>'
        );
    }

    /**
     * 初始化 Cropper
     * @param {HTMLImageElement} imageElement - 图片 DOM 元素
     * @param {Object} options - 配置项 { aspectRatio, initialCoverage }
     * @returns {Cropper} cropper 实例
     */
    init(imageElement, options = {}) {
        if (this.cropper) {
            this.destroy();
        }

        const template = this._buildTemplate(options);

        this.cropper = new Cropper(imageElement, {
            template
        });

        return this.cropper;
    }

    /**
     * 设置裁剪比例
     * @param {number} ratio - 宽高比 (如 1 表示 1:1, 0.75 表示 3:4)
     */
    setAspectRatio(ratio) {
        const selection = this.cropper?.getCropperSelection();
        if (selection) {
            selection.aspectRatio = ratio;
            selection.$center();
            selection.$render();
        }
    }

    /**
     * 旋转图片
     * @param {number} degree - 旋转角度（度）
     */
    rotate(degree) {
        const image = this.cropper?.getCropperImage();
        if (image) {
            image.$rotate(degree * Math.PI / 180);
        }
    }

    /**
     * 重置裁剪区域和图片变换
     */
    reset() {
        const selection = this.cropper?.getCropperSelection();
        const image = this.cropper?.getCropperImage();
        if (selection) selection.$reset();
        if (image) image.$resetTransform();
    }

    /**
     * 获取裁剪后的 Canvas
     * @param {Object} options - 输出配置 { width, height, beforeDraw }
     * @returns {Promise<HTMLCanvasElement|null>}
     */
    async getCroppedCanvas(options = {}) {
        const selection = this.cropper?.getCropperSelection();
        if (!selection) return null;
        return selection.$toCanvas({ ...this.outputOptions, ...options });
    }

    /**
     * 获取裁剪后的 Base64 图片数据
     * @param {Object} options - 输出配置 { width, height }
     * @param {string} type - 图片类型
     * @param {number} quality - 图片质量 0-1
     * @returns {Promise<string|null>}
     */
    async getCroppedImageBase64(options = {}, type = 'image/jpeg', quality = 0.92) {
        const canvas = await this.getCroppedCanvas(options);
        if (!canvas) return null;
        return canvas.toDataURL(type, quality);
    }

    /**
     * 获取裁剪后的 Blob 对象
     * @param {Object} options - 输出配置 { width, height }
     * @param {string} type - 图片类型
     * @param {number} quality - 图片质量 0-1
     * @returns {Promise<Blob|null>}
     */
    async getCroppedImageBlob(options = {}, type = 'image/jpeg', quality = 0.92) {
        const canvas = await this.getCroppedCanvas(options);
        if (!canvas) return null;
        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                resolve(blob);
            }, type, quality);
        });
    }

    /**
     * 下载裁剪后的图片
     * @param {string} filename - 文件名
     * @param {Object} options - 输出配置 { width, height }
     * @param {string} type - 图片类型
     * @param {number} quality - 图片质量
     */
    async downloadCroppedImage(filename = 'cropped-image.jpg', options = {}, type = 'image/jpeg', quality = 0.92) {
        const base64 = await this.getCroppedImageBase64(options, type, quality);
        if (!base64) return;

        const link = document.createElement('a');
        link.href = base64;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    /**
     * 销毁 Cropper 实例
     */
    destroy() {
        if (this.cropper) {
            this.cropper.destroy();
            this.cropper = null;
        }
    }

    /**
     * 检查是否已初始化
     * @returns {boolean}
     */
    isReady() {
        return !!this.cropper;
    }
}

/**
 * 预设的裁剪尺寸配置
 */
export const CROP_PRESETS = {
    // 1:1 正方形
    SQUARE: {
        ratio: 1,
        label: '1:1 正方形',
        description: '等边长裁剪'
    },
    // 3:4 比例 - 大尺寸
    RATIO_3_4_LARGE: {
        ratio: 3 / 4,
        width: 900,
        height: 1200,
        label: '3:4 大尺寸',
        description: '900 x 1200'
    },
    // 3:4 比例 - 中尺寸
    RATIO_3_4_MEDIUM: {
        ratio: 3 / 4,
        width: 750,
        height: 1000,
        label: '3:4 中尺寸',
        description: '750 x 1000'
    },
    // 3:4 比例 - 小尺寸
    RATIO_3_4_SMALL: {
        ratio: 3 / 4,
        width: 600,
        height: 800,
        label: '3:4 小尺寸',
        description: '600 x 800'
    }
};

/**
 * 快捷方法：创建 1:1 裁剪处理器
 * @param {HTMLImageElement} imageElement 
 * @param {number} sideLength - 边长（仅用于导出参考）
 * @returns {ImageProcessor}
 */
export function createSquareCropper(imageElement, sideLength = 800) {
    const processor = new ImageProcessor();
    processor.init(imageElement, {
        aspectRatio: 1,
        initialCoverage: 0.8
    });
    processor.setCropBoxData(sideLength, sideLength);
    return processor;
}

/**
 * 快捷方法：创建 3:4 裁剪处理器
 * @param {HTMLImageElement} imageElement 
 * @param {string} size - 'large' | 'medium' | 'small'
 * @returns {ImageProcessor}
 */
export function create34Cropper(imageElement, size = 'medium') {
    const sizeMap = {
        large: CROP_PRESETS.RATIO_3_4_LARGE,
        medium: CROP_PRESETS.RATIO_3_4_MEDIUM,
        small: CROP_PRESETS.RATIO_3_4_SMALL
    };

    const preset = sizeMap[size] || sizeMap.medium;
    const processor = new ImageProcessor();
    processor.init(imageElement, {
        aspectRatio: preset.ratio,
        initialCoverage: 0.8
    });
    processor.setCropBoxData(preset.width, preset.height);
    return processor;
}

export default ImageProcessor;
