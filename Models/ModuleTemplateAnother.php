<?php
/**
 * Copyright © MIKO LLC - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Alexey Portnov, 2 2019
 */


namespace Modules\ModuleTemplate\Models;

use Models\ModelsBase;
use Phalcon\Mvc\Model\Relation;

class ModuleTemplateAnother extends ModuleBaseClass
{
    /**
     * @Primary
     * @Identity
     * @Column(type="integer", nullable=false)
     */
    public $id;
    public $folder_id;
    public $service_account_id;
    public $key_data;
    public $key_id;
    public $o_auth_token;

    public $iam_token;

    public function getSource() {
        return 'm_ModuleTemplateAnother';
    }

	public function initialize() :void{
		parent::initialize();
		// $this->belongsTo(
		// 	'failoverextension',
		// 	'Models\Extensions',
		// 	'number',
		// 	[
		// 		'alias'      => 'ExtensionsFailOver',
		// 		'foreignKey' => [
		// 			'allowNulls' => FALSE,
		// 			'action'     => Relation::NO_ACTION,
		// 		],
		// 	]
		// );
		// $this->belongsTo(
		// 	'extension',
		// 	'Models\Extensions',
		// 	'number',
		// 	[
		// 		'alias'      => 'Extensions',
		// 		'foreignKey' => [
		// 			'allowNulls' => FALSE,
		// 			'action'     => Relation::NO_ACTION
		// 			//SmartIVR удаляем через его Extension
		// 		],
		// 	]
		// );
	}

	/**
	 * Возвращает структуру подключаемых отношений модуля, которые динамически
	 * подключаеют в ModelsBase при инициализации модуля
	 *
	 * При описании отношений необходимо в foreignKey секцию добавлять атрибут
	 * message в котором указывать алиас после слова Models,
	 * например Models\IvrMenuTimeout, иначе метод getRelated не сможет найти зависимые
	 * записи в моделях
	 */
	public static function getDynamicRelations($calledClass) :array{
		$result = [];
		// if ($calledClass === "Models\Extensions"){
		// 	$result =[
		// 		'hasOne'=>[
		// 			'number',
		// 			'Modules\ModuleTemplate\Models\ModuleTemplate',
		// 			'failoverextension',
		// 			[
		// 				'alias'=>'ModuleTemplateFailOver',
		// 				'foreignKey' => [
		// 					'allowNulls' => 0,
		// 					'message'    => 'Models\ModuleTemplateFailOver',
		// 					'action'     => Relation::ACTION_RESTRICT
		// 				]
		// 			]
		// 		],
		// 		'hasOne'=>[
		// 			'number',
		// 			'Modules\ModuleTemplate\Models\ModuleTemplate',
		// 			'extension',
		// 			[
		// 				'alias'=>'ModuleTemplate',
		// 				'foreignKey' => [
		// 					'allowNulls' => 0,
		// 					'message'    => 'Models\ModuleTemplate',
		// 					'action'     => Relation::ACTION_CASCADE
		// 				]
		// 			]
		// 		],
		// 	];
		// }
		return $result;
	}

}