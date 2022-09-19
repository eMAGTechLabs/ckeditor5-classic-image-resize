import Plugin from "@ckeditor/ckeditor5-core/src/plugin";
import ClassicImageResizeCommand from "./classicimageresizecommand";
import ImageUtils from "@ckeditor/ckeditor5-image/src/imageutils";

export default class ClassicImageResizeEditing extends Plugin {
    /**
     * @inheritDoc
     */
    static get requires() {
        return [ ImageUtils ];
    }
    /**
     * @inheritDoc
     */
    static get pluginName() {
        return 'ImageSizeEditing';
    }

    /**
     * @inheritDoc
     */
    init() {
        const editor = this.editor;
        const schema = editor.model.schema;
        const dimensions = ['width'];


        // Register imageSize command.
        editor.commands.add( 'imageSize', new ClassicImageResizeCommand( editor ) );
        schema.register( 'imageSize', {
          allowWhere: '$text',
          isInline: true,
          isObject: true,
          allowAttributes: [
            'equation', 'type', 'display', 'fontBackgroundColor', 'fontColor' //allow fontBackgroundColor and fontcolor
          ]
        } );

        schema.extend( 'imageInline', {
            allowAttributes: [
                'max-width'
            ]
        } );
        schema.extend( 'imageBlock', {
          allowAttributes: [
            'max-width'
          ]
        } );


        for ( let key in dimensions ) {
            let downcastConverter = this._modelToViewConverter(dimensions[key]);

            editor.editing.downcastDispatcher.on( `attribute:${dimensions[key]}:image`, downcastConverter);
            editor.data.downcastDispatcher.on( `attribute:${dimensions[key]}:image`, downcastConverter);

            this._viewToModelConverter(editor, dimensions[key]);
        }
    }

    _modelToViewConverter(dimension) {
       return ( evt, data, conversionApi ) => {
            if ( !conversionApi.consumable.consume( data.item, evt.name ) ) {
                return;
            }

           const viewWriter = conversionApi.writer;
           const figure = conversionApi.mapper.toViewElement( data.item );

           const viewImage = [ ...figure.getChildren() ]
               .find( element => element.name === 'img' );

           const resizeUnit = this.editor.config.get( 'image.resizeUnit' ) || '%';
           if ( data.attributeNewValue !== null ) {
               viewWriter.setStyle( dimension, data.attributeNewValue + resizeUnit, figure );
               viewWriter.setStyle( dimension, data.attributeNewValue + resizeUnit, viewImage);
           } else {
               viewWriter.removeStyle( dimension, figure );
               viewWriter.removeStyle( dimension, viewImage);
           }
           viewWriter.removeClass( 'image_resized', figure );
        }
    }

    _viewToModelConverter(editor, dimension) {
        editor.conversion.for( 'upcast' ).attributeToAttribute( {
            view: {
                name: 'img',
                styles: {
                    [dimension]: /.+/
                }
            },
            model: {
                key: dimension,
                value: viewElement => viewElement.getStyle(dimension).match(/\d+/g)
            },
            converterPriority: 'low'
        } );
    }
}
